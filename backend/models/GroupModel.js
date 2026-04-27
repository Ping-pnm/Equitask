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
        const sql = `SELECT * FROM groups WHERE assignmentId = ?`;
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
    }
};

export default GroupModel;
