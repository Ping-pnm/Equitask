import pool from '../db.js';

const GroupModel = {
    getClassMembersWithGroupStatus: async (classId, assignmentId) => {
        try {
            const membersSql = `
                SELECT 
                    u.userId, u.email, u.firstName, u.lastName,
                    mg.groupId
                FROM users u
                JOIN enrollments e ON u.userId = e.userId
                LEFT JOIN (
                    SELECT m.userId, m.groupId
                    FROM memberships m
                    JOIN groups g ON m.groupId = g.groupId
                    WHERE g.assignmentId = ?
                ) mg ON u.userId = mg.userId
                WHERE e.classId = ?
            `;
            const [members] = await pool.query(membersSql, [assignmentId, classId]);

            return members.map(m => ({
                ...m,
                hasGroup: m.groupId !== null
            }));
        } catch (err) {
            console.error("GroupModel.getClassMembersWithGroupStatus Error:", err);
            throw err;
        }
    },

    createGroup: async (groupName, assignmentId, creatorId, classId, meetLink, memberIds) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Create the group record
            const groupSql = `
                INSERT INTO groups (groupName, assignmentId, classId, meetLink)
                VALUES (?, ?, ?, ?)
            `;
            const [groupRes] = await connection.query(groupSql, [groupName, assignmentId, classId, meetLink || null]);
            const groupId = groupRes.insertId;

            // 2. Add entries to memberships table
            const allMemberIds = Array.from(new Set([creatorId, ...memberIds]));
            const membershipSql = `INSERT INTO memberships (groupId, userId) VALUES (?, ?)`;

            for (const userId of allMemberIds) {
                await connection.query(membershipSql, [groupId, userId]);
            }

            await connection.commit();
            return groupId;
        } catch (err) {
            await connection.rollback();
            console.error("GroupModel.createGroup Error:", err);
            throw err;
        } finally {
            connection.release();
        }
    },

    checkUserHasGroup: async (userId, assignmentId) => {
        const sql = `
            SELECT m.groupId 
            FROM memberships m
            JOIN groups g ON m.groupId = g.groupId
            WHERE m.userId = ? AND g.assignmentId = ?
        `;
        const [rows] = await pool.query(sql, [userId, assignmentId]);
        return rows.length > 0;
    },

    getGroupForUser: async (userId, assignmentId) => {
        const sql = `
            SELECT g.* 
            FROM groups g
            JOIN memberships m ON g.groupId = m.groupId
            WHERE m.userId = ? AND g.assignmentId = ?
        `;
        const [rows] = await pool.query(sql, [userId, assignmentId]);
        return rows[0] || null;
    },

    getAllGroupsForAssignment: async (assignmentId) => {
        const sql = `
            SELECT g.*, u.userId, u.firstName, u.lastName, u.email,
                   (SELECT AVG(t.progress) 
                    FROM tasks t 
                    WHERE t.groupId = g.groupId AND t.assignmentId = g.assignmentId) as groupProgress
            FROM groups g
            LEFT JOIN memberships m ON g.groupId = m.groupId
            LEFT JOIN users u ON m.userId = u.userId
            WHERE g.assignmentId = ?
        `;
        const [rows] = await pool.query(sql, [assignmentId]);
        return rows;
    },

    deleteGroup: async (groupId) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // Delete memberships first due to foreign key constraints if any
            await connection.query(`DELETE FROM memberships WHERE groupId = ?`, [groupId]);
            await connection.query(`DELETE FROM groups WHERE groupId = ?`, [groupId]);
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            console.error("GroupModel.deleteGroup Error:", err);
            throw err;
        } finally {
            connection.release();
        }
    },

    getGroupById: async (groupId) => {
        const sql = `
            SELECT g.*, u.userId, u.firstName, u.lastName, u.email
            FROM groups g
            LEFT JOIN memberships m ON g.groupId = m.groupId
            LEFT JOIN users u ON m.userId = u.userId
            WHERE g.groupId = ?
        `;
        const [rows] = await pool.query(sql, [groupId]);
        if (rows.length === 0) return null;

        const group = {
            groupId: rows[0].groupId,
            groupName: rows[0].groupName,
            assignmentId: rows[0].assignmentId,
            classId: rows[0].classId,
            meetLink: rows[0].meetLink,
            createdAt: rows[0].createdAt,
            isSubmitted: rows[0].isSubmitted,
            grades: rows[0].grades,
            members: [],
            files: []
        };

        rows.forEach(row => {
            if (row.userId) {
                const alreadyAdded = group.members.some(m => m.userId === row.userId);
                if (!alreadyAdded) {
                    group.members.push({
                        userId: row.userId,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        email: row.email
                    });
                }
            }
        });

        // Fetch Group Work Files
        const filesSql = `SELECT * FROM files WHERE groupId = ?`;
        const [files] = await pool.query(filesSql, [groupId]);
        group.files = files;

        // Fetch Tasks for each member
        for (const member of group.members) {
            const taskSql = `
                SELECT t.*,
                       CASE 
                           WHEN t.progress = 100 THEN 'COMPLETED'
                           WHEN t.progress >= 50 THEN 'IN PROGRESS'
                           WHEN t.progress > 0 THEN 'AT RISK'
                           ELSE 'WAITING'
                       END as status
                FROM tasks t 
                WHERE t.groupId = ? AND t.userId = ? AND t.assignmentId = ?
            `;
            const [tasks] = await pool.query(taskSql, [groupId, member.userId, group.assignmentId]);
            member.tasks = tasks;
        }

        return group;
    },

    updateGroup: async (groupId, groupName, meetLink, memberIds, creatorId) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Update the group record
            const groupSql = `
                UPDATE groups 
                SET groupName = ?, meetLink = ?
                WHERE groupId = ?
            `;
            await connection.query(groupSql, [groupName, meetLink || null, groupId]);

            // 2. Refresh memberships
            // Delete all current memberships for this group
            await connection.query(`DELETE FROM memberships WHERE groupId = ?`, [groupId]);

            // Add new memberships (ensuring creator is included)
            const allMemberIds = Array.from(new Set([creatorId, ...memberIds]));
            const membershipSql = `INSERT INTO memberships (groupId, userId) VALUES (?, ?)`;

            for (const userId of allMemberIds) {
                await connection.query(membershipSql, [groupId, userId]);
            }

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            console.error("GroupModel.updateGroup Error:", err);
            throw err;
        } finally {
            connection.release();
        }
    },

    checkUserHasAnotherGroup: async (userId, assignmentId, currentGroupId) => {
        const sql = `
            SELECT m.groupId 
            FROM memberships m
            JOIN groups g ON m.groupId = g.groupId
            WHERE m.userId = ? AND g.assignmentId = ? AND g.groupId != ?
        `;
        const [rows] = await pool.query(sql, [userId, assignmentId, currentGroupId]);
        return rows.length > 0;
    },

    getGroupComments: async (groupId) => {
        const sql = `
            SELECT gc.*, u.firstName, u.lastName, u.email
            FROM groupcomments gc
            JOIN users u ON gc.userId = u.userId
            WHERE gc.groupId = ?
            ORDER BY gc.createdAt ASC
        `;
        const [rows] = await pool.query(sql, [groupId]);
        return rows;
    },

    addGroupComment: async (groupId, userId, comment) => {
        const sql = `
            INSERT INTO groupcomments (groupId, userId, comment)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(sql, [groupId, userId, comment]);
        return result.insertId;
    },

    trackMeetJoin: async (userId, groupId) => {
        const sql = `
            INSERT INTO meettracking (userId, groupId)
            VALUES (?, ?)
        `;
        const [result] = await pool.query(sql, [userId, groupId]);
        return result.insertId;
    },

    getMeetTracking: async (groupId) => {
        const sql = `
            SELECT mt.*, u.firstName, u.lastName, u.email
            FROM meettracking mt
            JOIN users u ON mt.userId = u.userId
            WHERE mt.groupId = ?
            ORDER BY mt.timestamp DESC
        `;
        const [rows] = await pool.query(sql, [groupId]);
        return rows;
    },

    uploadGroupFile: async (groupId, assignmentId, fileUrl) => {
        const sql = `
            INSERT INTO files (fileUrl, groupId, assignmentId)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(sql, [fileUrl, groupId, assignmentId]);
        return result.insertId;
    },

    deleteGroupFile: async (fileId) => {
        const sql = `DELETE FROM files WHERE fileId = ?`;
        const [result] = await pool.query(sql, [fileId]);
        return result.affectedRows > 0;
    },

    submitGroupWork: async (groupId, assignmentId, isSubmitted) => {
        const sql = `
            UPDATE groups 
            SET isSubmitted = ? 
            WHERE groupId = ?
        `;
        const [result] = await pool.query(sql, [isSubmitted ? 1 : 0, groupId]);
        return result.affectedRows > 0;
    }
};

export default GroupModel;
