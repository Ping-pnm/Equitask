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
                    JOIN \`groups\` g ON m.groupId = g.groupId
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
                INSERT INTO \`groups\` (groupName, assignmentId, classId, meetLink)
                VALUES (?, ?, ?, ?)
            `;
            const [groupRes] = await connection.query(groupSql, [groupName, assignmentId, classId, meetLink || null]);
            const groupId = groupRes.insertId;

            // 2. Add entries to memberships table (use exactly the members provided)
            const membershipSql = `INSERT INTO memberships (groupId, userId) VALUES (?, ?)`;

            for (const userId of memberIds) {
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
            JOIN \`groups\` g ON m.groupId = g.groupId
            WHERE m.userId = ? AND g.assignmentId = ?
        `;
        const [rows] = await pool.query(sql, [userId, assignmentId]);
        return rows.length > 0;
    },

    getGroupForUser: async (userId, assignmentId) => {
        // Step 1: Get the group basic info
        const sql = `
            SELECT g.*
            FROM \`groups\` g
            JOIN memberships m ON g.groupId = m.groupId
            WHERE m.userId = ? AND g.assignmentId = ?
        `;
        const [rows] = await pool.query(sql, [userId, assignmentId]);
        if (rows.length === 0) return null;
        
        const group = rows[0];
        const groupId = group.groupId;

        // Step 2: Get members
        const membersSql = `
            SELECT 
                m.userId,
                CONCAT(u.firstName, ' ', u.lastName) as name
            FROM memberships m
            JOIN users u ON m.userId = u.userId
            WHERE m.groupId = ?
        `;
        const [members] = await pool.query(membersSql, [groupId]);

        // Step 3: Get tasks for all members in this group
        const tasksSql = `
            SELECT 
                t.taskId, t.userId,
                COALESCE(
                    (SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1),
                0) as progress
            FROM tasks t
            WHERE t.groupId = ? AND t.assignmentId = ?
        `;
        const [tasks] = await pool.query(tasksSql, [groupId, assignmentId]);

        // Step 4: Map members with their progress
        const groupMembers = members.map(m => {
            const memberTasks = tasks.filter(t => t.userId === m.userId);
            const memberProgress = memberTasks.length > 0
                ? Math.round(memberTasks.reduce((sum, t) => sum + (Number(t.progress) || 0), 0) / memberTasks.length)
                : 0;
            return {
                ...m,
                progress: memberProgress
            };
        });

        // Step 5: Flat average for legacy overall progress field
        const groupProgress = tasks.length > 0
            ? tasks.reduce((sum, t) => sum + (Number(t.progress) || 0), 0) / tasks.length
            : 0;

        return {
            ...group,
            groupProgress: groupProgress,
            members: groupMembers
        };
    },

    getAllGroupsForAssignment: async (assignmentId) => {
        // Step 1: Get all groups with their overall progress
        const groupsSql = `
            SELECT g.*,
                   COALESCE(
                       (SELECT AVG(
                           COALESCE((SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1), 0)
                       ) FROM tasks t WHERE t.groupId = g.groupId AND t.assignmentId = g.assignmentId),
                   0) as groupProgress
            FROM \`groups\` g
            WHERE g.assignmentId = ?
        `;
        const [groups] = await pool.query(groupsSql, [assignmentId]);

        if (groups.length === 0) return [];

        // Step 2: Get all members for these groups with their memberProgress
        const groupIds = groups.map(g => g.groupId);
        const membersSql = `
            SELECT 
                m.groupId,
                m.userId,
                CONCAT(u.firstName, ' ', u.lastName) as name
            FROM memberships m
            JOIN users u ON m.userId = u.userId
            WHERE m.groupId IN (?)
        `;
        const [members] = await pool.query(membersSql, [groupIds]);

        // Step 3: Get all tasks for these groups with their latest progress
        const tasksSql = `
            SELECT 
                t.taskId,
                t.name,
                t.userId,
                t.groupId,
                COALESCE(
                    (SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1),
                0) as progress
            FROM tasks t
            WHERE t.groupId IN (?) AND t.assignmentId = ?
        `;
        const [tasks] = await pool.query(tasksSql, [groupIds, assignmentId]);

        // Step 4: Assemble the result in JavaScript
        return groups.map(group => {
            const groupMembers = members
                .filter(m => m.groupId === group.groupId)
                .map(m => {
                    const memberTasks = tasks
                        .filter(t => t.groupId === group.groupId && t.userId === m.userId)
                        .map(t => ({
                            taskId: t.taskId,
                            name: t.name,
                            progress: Number(t.progress) || 0
                        }));

                    // Calculate member progress dynamically from their tasks' latest progress
                    const memberProgress = memberTasks.length > 0
                        ? Math.round(memberTasks.reduce((sum, t) => sum + t.progress, 0) / memberTasks.length)
                        : 0;

                    return {
                        userId: m.userId,
                        name: m.name,
                        progress: memberProgress,
                        tasks: memberTasks
                    };
                });

            return {
                ...group,
                groupProgress: Number(group.groupProgress) || 0,
                members: groupMembers
            };
        });
    },

    deleteGroup: async (groupId) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // Delete memberships first due to foreign key constraints if any
            await connection.query(`DELETE FROM memberships WHERE groupId = ?`, [groupId]);
            await connection.query(`DELETE FROM \`groups\` WHERE groupId = ?`, [groupId]);
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
            FROM \`groups\` g
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
            files: [],
            links: []
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

        // Fetch Group Work Files (where taskId and userId are NULL)
        const filesSql = `SELECT * FROM files WHERE groupId = ? AND assignmentId = ? AND taskId IS NULL AND userId IS NULL`;
        const [files] = await pool.query(filesSql, [groupId, group.assignmentId]);
        group.files = files;

        // Fetch Group Work Links (where taskId and userId are NULL)
        const linksSql = `SELECT * FROM links WHERE groupId = ? AND assignmentId = ? AND taskId IS NULL AND userId IS NULL`;
        const [links] = await pool.query(linksSql, [groupId, group.assignmentId]);
        group.links = links;

        // Fetch Tasks for each member
        for (const member of group.members) {
            const taskSql = `
                SELECT t.*,
                       COALESCE((SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1), 0) as progress,
                       CASE 
                           WHEN (SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1) = 100 THEN 'COMPLETED'
                           WHEN (SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1) >= 50 THEN 'IN PROGRESS'
                           WHEN (SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1) > 0 THEN 'AT RISK'
                           ELSE 'WAITING'
                       END as status
                FROM tasks t 
                WHERE t.groupId = ? AND t.userId = ? AND t.assignmentId = ?
            `;
            const [tasks] = await pool.query(taskSql, [groupId, member.userId, group.assignmentId]);
            
            // For each task, fetch links
            for (const task of tasks) {
                const taskLinkSql = `SELECT * FROM links WHERE taskId = ?`;
                const [taskLinks] = await pool.query(taskLinkSql, [task.taskId]);
                task.links = taskLinks;
            }
            
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
                UPDATE \`groups\` 
                SET groupName = ?, meetLink = ?
                WHERE groupId = ?
            `;
            await connection.query(groupSql, [groupName, meetLink || null, groupId]);

            // 2. Refresh memberships
            // Delete all current memberships for this group
            await connection.query(`DELETE FROM memberships WHERE groupId = ?`, [groupId]);

            // Add new memberships (use exactly the members provided, no forced creatorId)
            const membershipSql = `INSERT INTO memberships (groupId, userId) VALUES (?, ?)`;

            for (const userId of memberIds) {
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
            JOIN \`groups\` g ON m.groupId = g.groupId
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
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Update group submission status
            const sql = `UPDATE \`groups\` SET isSubmitted = ? WHERE groupId = ?`;
            await connection.query(sql, [isSubmitted ? 1 : 0, groupId]);

            let selections = [];

            if (isSubmitted) {
                // 2. Randomize Rubric Selections for the Assignment
                const rubricSql = `SELECT * FROM rubrics WHERE assignmentId = ?`;
                const [rubrics] = await connection.query(rubricSql, [assignmentId]);
                
                if (rubrics.length > 0) {
                    const rubricId = rubrics[0].rubricId;
                    
                    // Fetch Criteria and Levels
                    const [criteriaRows] = await connection.query(`SELECT * FROM criteria WHERE rubricId = ? ORDER BY sort_order ASC`, [rubricId]);
                    const [levelRows] = await connection.query(`SELECT * FROM levels WHERE rubricId = ? ORDER BY sort_order ASC`, [rubricId]);

                    if (criteriaRows.length > 0 && levelRows.length > 0) {
                        for (const crit of criteriaRows) {
                            const randomIdx = Math.floor(Math.random() * levelRows.length);
                            const selectedLevel = levelRows[randomIdx];
                            
                            selections.push({ criteriaId: crit.criteriaId, levelId: selectedLevel.levelId });

                            // Update criteria table with the random selection
                            await connection.query(`UPDATE criteria SET selectedLevelId = ? WHERE criteriaId = ?`, [selectedLevel.levelId, crit.criteriaId]);
                        }
                    }
                }
            }

            await connection.commit();
            return { success: true, selections };
        } catch (err) {
            await connection.rollback();
            console.error("GroupModel.submitGroupWork Error:", err);
            throw err;
        } finally {
            connection.release();
        }
    },

    gradeGroup: async (groupId, grades) => {
        const sql = `UPDATE \`groups\` SET grades = ? WHERE groupId = ?`;
        const [result] = await pool.query(sql, [grades, groupId]);
        return result.affectedRows > 0;
    }
};

export default GroupModel;
