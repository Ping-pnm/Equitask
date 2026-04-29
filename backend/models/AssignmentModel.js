import pool from '../db.js';

const AssignmentModel = {
    getAllByClassId: async (classId, userId = null, onlyGroupWork = false) => {
        try {
            // Step 1: Get all assignments for the class
            const assignmentSql = `
                SELECT 
                    a.*, 
                    u.firstName, u.lastName,
                    COALESCE(ua.isSubmitted, 0) as isSubmitted,
                    ua.grades as grades
                FROM assignments a
                JOIN users u ON a.creatorId = u.userId
                LEFT JOIN userAssignments ua ON a.assignmentId = ua.assignmentId AND ua.userId = ?
                WHERE a.classId = ? ${onlyGroupWork ? 'AND a.isGroupWork = 1' : ''}
                ORDER BY a.createdAt DESC
            `;
            const [assignments] = await pool.query(assignmentSql, [userId, classId]);

            if (assignments.length === 0) return [];

            const assignmentIds = assignments.map(a => a.assignmentId);

            // Step 2: Find which group the current user belongs to for each assignment
            const userGroupSql = `
                SELECT g.groupId, g.groupName, g.assignmentId, g.isSubmitted, g.grades,
                       COALESCE(
                           (SELECT AVG(COALESCE((SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1), 0))
                            FROM tasks t WHERE t.groupId = g.groupId AND t.assignmentId = g.assignmentId),
                       0) as groupProgress
                FROM memberships m
                JOIN \`groups\` g ON m.groupId = g.groupId
                WHERE m.userId = ? AND g.assignmentId IN (?)
            `;
            const [userGroups] = await pool.query(userGroupSql, [userId, assignmentIds]);
            
            const groupIds = userGroups.map(g => g.groupId);

            // Step 3: Get all members for these groups
            let membersMap = {};
            let tasksMap = {};

            if (groupIds.length > 0) {
                const membersSql = `
                    SELECT m.groupId, m.userId,
                           CONCAT(u.firstName, ' ', u.lastName) as name
                    FROM memberships m
                    JOIN users u ON m.userId = u.userId
                    WHERE m.groupId IN (?)
                `;
                const [members] = await pool.query(membersSql, [groupIds]);
                members.forEach(m => {
                    if (!membersMap[m.groupId]) membersMap[m.groupId] = [];
                    membersMap[m.groupId].push(m);
                });

                // Step 4: Get all tasks for these groups
                const tasksSql = `
                    SELECT t.taskId, t.name, t.userId, t.groupId, t.assignmentId,
                           COALESCE(
                               (SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1),
                           0) as progress
                    FROM tasks t
                    WHERE t.groupId IN (?) AND t.assignmentId IN (?)
                `;
                const [tasks] = await pool.query(tasksSql, [groupIds, assignmentIds]);
                tasks.forEach(t => {
                    const key = `${t.groupId}_${t.userId}`;
                    if (!tasksMap[key]) tasksMap[key] = [];
                    tasksMap[key].push({ taskId: t.taskId, name: t.name, progress: Number(t.progress) || 0 });
                });
            }

            // Step 5: Assemble result
            const userGroupByAssignment = {};
            userGroups.forEach(g => { userGroupByAssignment[g.assignmentId] = g; });

            return assignments.map(a => {
                const groupInfo = userGroupByAssignment[a.assignmentId] || null;
                let members = [];
                let groupProgress = 0;

                if (groupInfo) {
                    const rawMembers = membersMap[groupInfo.groupId] || [];
                    members = rawMembers.map(m => {
                        const memberTasks = tasksMap[`${groupInfo.groupId}_${m.userId}`] || [];
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
                    groupProgress = Number(groupInfo.groupProgress) || 0;
                }

                return {
                    ...a,
                    isSubmitted: groupInfo ? (groupInfo.isSubmitted || a.isSubmitted || 0) : (a.isSubmitted || 0),
                    grades: groupInfo?.grades ?? a.grades,
                    groupId: groupInfo?.groupId || null,
                    groupName: groupInfo?.groupName || null,
                    groupProgress,
                    members
                };
            });
        } catch(err) {
            console.error("Database Error (getAllByClassId)", err);
            throw err;
        }
    },
    create: async (data) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insert into assignments (Note: 'instructions' plural per schema)
            const assignmentSql = `
                INSERT INTO assignments (
                    title, instructions, points, dueDate, 
                    isGroupWork, creatorId, classId
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const assignmentParams = [
                data.title,
                data.instruction, // Frontend calls it instruction
                data.points,
                data.dueDate,
                data.isGroupWork ? 1 : 0,
                data.creatorId,
                data.classId
            ];

            const [assignmentResult] = await connection.query(assignmentSql, assignmentParams);
            const assignmentId = assignmentResult.insertId;

            // 2. Insert into rubrics (link to assignmentId)
            const rubricSql = `
                INSERT INTO rubrics (title, assignmentId)
                VALUES (?, ?)
            `;
            const [rubricResult] = await connection.query(rubricSql, [`Rubric for ${data.title}`, assignmentId]);
            const rubricId = rubricResult.insertId;

            // 3. Insert into criteria (Rows)
            const criteriaIds = [];
            if (data.rubrics && data.rubrics.criterias) {
                const numCriteria = data.rubrics.criterias.length;
                const maxPct = numCriteria > 0 ? (100 / numCriteria) : 0;
                
                const criteriaSql = `
                    INSERT INTO criteria (title, sort_order, rubricId, maxPercentage)
                    VALUES (?, ?, ?, ?)
                `;
                for (let i = 0; i < data.rubrics.criterias.length; i++) {
                    const criteriaTitle = data.rubrics.criterias[i];
                    const [res] = await connection.query(criteriaSql, [criteriaTitle || '', i, rubricId, maxPct]);
                    criteriaIds.push(res.insertId);
                }
            }

            // 4. Insert into levels (Columns)
            const levelIds = [];
            if (data.rubrics && data.rubrics.levels) {
                const levelsSql = `
                    INSERT INTO levels (title, sort_order, rubricId)
                    VALUES (?, ?, ?)
                `;
                for (let i = 0; i < data.rubrics.levels.length; i++) {
                    const levelTitle = data.rubrics.levels[i];
                    const [res] = await connection.query(levelsSql, [levelTitle || '', i, rubricId]);
                    levelIds.push(res.insertId);
                }
            }

            // 5. Insert into rubriccells (The Content)
            if (data.rubrics && data.rubrics.cells && criteriaIds.length > 0 && levelIds.length > 0) {
                const cellSql = `
                    INSERT INTO rubriccells (criteriaId, levelId, content)
                    VALUES (?, ?, ?)
                `;
                for (let r = 0; r < data.rubrics.cells.length; r++) {
                    for (let c = 0; c < data.rubrics.cells[r].length; c++) {
                        const content = data.rubrics.cells[r][c];
                        const criteriaId = criteriaIds[r];
                        const levelId = levelIds[c];
                        if (criteriaId && levelId) {
                            await connection.query(cellSql, [criteriaId, levelId, content || '']);
                        }
                    }
                }
            }

            // 6. Handle Files
            if (data.files && data.files.length > 0) {
                const fileSql = `
                    INSERT INTO files (fileUrl, assignmentId)
                    VALUES (?, ?)
                `;
                for (const file of data.files) {
                    await connection.query(fileSql, [file.fileUrl, assignmentId]);
                }
            }

            // 6. Handle linking tables (Group vs Individual)
            if (!data.isGroupWork) {
                // If individual, link all students (members) in class to this assignment, excluding leaders
                const enrollmentSql = `
                    SELECT userId FROM enrollments 
                    WHERE classId = ? 
                    AND userId NOT IN (SELECT userId FROM owners WHERE classId = ?)
                `;
                const [students] = await connection.query(enrollmentSql, [data.classId, data.classId]);
                
                if (students.length > 0) {
                    const userAssignmentSql = `
                        INSERT INTO userAssignments (userId, assignmentId, isSubmitted, grades)
                        VALUES (?, ?, 0, NULL)
                    `;
                    for (const student of students) {
                        await connection.query(userAssignmentSql, [student.userId, assignmentId]);
                    }
                }
            }

            await connection.commit();
            return assignmentId;
        } catch (err) {
            await connection.rollback();
            console.error("Database Error (create assignment):", err);
            throw err;
        } finally {
            connection.release();
        }
    },
    getById: async (assignmentId, userId = null) => {
        try {
            // 1. Get Assignment
            let assignmentSql = `SELECT * FROM assignments WHERE assignmentId = ?`;
            let assignmentParams = [assignmentId];

            if (userId) {
                assignmentSql = `
                    SELECT 
                        a.*,
                        COALESCE(ua.isSubmitted, g.isSubmitted, 0) as isSubmitted,
                        COALESCE(ua.grades, g.grades) as grades
                    FROM assignments a
                    LEFT JOIN userAssignments ua ON a.assignmentId = ua.assignmentId AND ua.userId = ?
                    LEFT JOIN (
                        SELECT m.userId, g.groupId, g.assignmentId, g.isSubmitted, g.grades
                        FROM memberships m
                        JOIN \`groups\` g ON m.groupId = g.groupId
                    ) g ON a.assignmentId = g.assignmentId AND g.userId = ?
                    WHERE a.assignmentId = ?
                `;
                assignmentParams = [userId, userId, assignmentId];
            }

            const [assignments] = await pool.query(assignmentSql, assignmentParams);
            if (assignments.length === 0) return null;
            const assignment = assignments[0];

            // 2. Get Rubric
            const rubricSql = `SELECT * FROM rubrics WHERE assignmentId = ?`;
            const [rubrics] = await pool.query(rubricSql, [assignmentId]);
            
            let criteria = [];
            let levels = [];
            let rubricCells = [];

            if (rubrics.length > 0) {
                const rubricId = rubrics[0].rubricId;
                // 3. Get Criteria
                const criteriaSql = `SELECT * FROM criteria WHERE rubricId = ? ORDER BY sort_order ASC`;
                [criteria] = await pool.query(criteriaSql, [rubricId]);
                
                // 4. Get Levels (Filtered by rubricId)
                const levelsSql = `SELECT * FROM levels WHERE rubricId = ? ORDER BY sort_order ASC`;
                [levels] = await pool.query(levelsSql, [rubricId]);

                // 5. Get Rubric Cells
                if (criteria.length > 0 && levels.length > 0) {
                    const criteriaIds = criteria.map(c => c.criteriaId);
                    const levelIds = levels.map(l => l.levelId);
                    
                    const cellsSql = `
                        SELECT * FROM rubriccells 
                        WHERE criteriaId IN (?) AND levelId IN (?)
                    `;
                    const [cellRows] = await pool.query(cellsSql, [criteriaIds, levelIds]);
                    
                    // Construct 2D array [row][col]
                    rubricCells = Array.from({ length: criteriaIds.length }, () => 
                        Array(levelIds.length).fill('')
                    );
                    
                    cellRows.forEach(row => {
                        const rIndex = criteriaIds.indexOf(row.criteriaId);
                        const cIndex = levelIds.indexOf(row.levelId);
                        if (rIndex !== -1 && cIndex !== -1) {
                            rubricCells[rIndex][cIndex] = row.content;
                        }
                    });
                }
            }

            // 6. Get Files (Assignment level)
            const fileSql = `SELECT * FROM files WHERE assignmentId = ? AND groupId IS NULL AND taskId IS NULL AND userId IS NULL`;
            const [files] = await pool.query(fileSql, [assignmentId]);

            // 7. Get User Files (if userId provided, for individual work)
            let userFiles = [];
            if (userId) {
                const userFileSql = `SELECT * FROM files WHERE assignmentId = ? AND userId = ? AND groupId IS NULL AND taskId IS NULL`;
                [userFiles] = await pool.query(userFileSql, [assignmentId, userId]);
            }

            return {
                ...assignment,
                rubric: rubrics[0] || null,
                criteria,
                levels,
                rubricCells,
                files,
                userFiles
            };
        } catch (err) {
            console.error("Database Error (getById)", err);
            throw err;
        }
    },
    update: async (assignmentId, data) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Update Assignment
            const sql = `
                UPDATE assignments 
                SET title = ?, instructions = ?, points = ?, dueDate = ?, isGroupWork = ?
                WHERE assignmentId = ?
            `;
            const params = [
                data.title,
                data.instruction,
                data.points,
                data.dueDate,
                data.isGroupWork ? 1 : 0,
                assignmentId
            ];

            console.log("Updating assignment:", assignmentId, data);
            const [result] = await connection.query(sql, params);
            console.log("Update result:", result.affectedRows, "rows affected");

            // 2. Sync Rubrics (Delete and Re-insert logic)
            const [rubricRows] = await connection.query(`SELECT rubricId FROM rubrics WHERE assignmentId = ?`, [assignmentId]);
            if (rubricRows.length > 0) {
                const rubricId = rubricRows[0].rubricId;
                
                // Delete existing rubric content (cells first due to FK, then criteria/levels)
                await connection.query(`DELETE FROM rubriccells WHERE criteriaId IN (SELECT criteriaId FROM criteria WHERE rubricId = ?)`, [rubricId]);
                await connection.query(`DELETE FROM criteria WHERE rubricId = ?`, [rubricId]);
                await connection.query(`DELETE FROM levels WHERE rubricId = ?`, [rubricId]);

                // Re-insert criteria
                const criteriaIds = [];
                if (data.rubrics && data.rubrics.criterias) {
                    const criteriaSql = `INSERT INTO criteria (title, sort_order, rubricId) VALUES (?, ?, ?)`;
                    for (let i = 0; i < data.rubrics.criterias.length; i++) {
                        const [res] = await connection.query(criteriaSql, [data.rubrics.criterias[i] || '', i, rubricId]);
                        criteriaIds.push(res.insertId);
                    }
                }

                // Re-insert levels
                const levelIds = [];
                if (data.rubrics && data.rubrics.levels) {
                    const levelsSql = `INSERT INTO levels (title, sort_order, rubricId) VALUES (?, ?, ?)`;
                    for (let i = 0; i < data.rubrics.levels.length; i++) {
                        const [res] = await connection.query(levelsSql, [data.rubrics.levels[i] || '', i, rubricId]);
                        levelIds.push(res.insertId);
                    }
                }

                // Re-insert cells
                if (data.rubrics && data.rubrics.cells && criteriaIds.length > 0 && levelIds.length > 0) {
                    const cellSql = `INSERT INTO rubriccells (criteriaId, levelId, content) VALUES (?, ?, ?)`;
                    for (let r = 0; r < data.rubrics.cells.length; r++) {
                        for (let c = 0; c < data.rubrics.cells[r].length; c++) {
                            const content = data.rubrics.cells[r][c];
                            const criteriaId = criteriaIds[r];
                            const levelId = levelIds[c];
                            if (criteriaId && levelId) {
                                await connection.query(cellSql, [criteriaId, levelId, content || '']);
                            }
                        }
                    }
                }
            }

            // 3. Sync Files (Delete and Re-insert)
            await connection.query(`DELETE FROM files WHERE assignmentId = ?`, [assignmentId]);
            if (data.files && data.files.length > 0) {
                const fileSql = `INSERT INTO files (fileUrl, assignmentId) VALUES (?, ?)`;
                for (const file of data.files) {
                    await connection.query(fileSql, [file.fileUrl, assignmentId]);
                }
            }

            await connection.commit();
            return result.affectedRows > 0;
        } catch (err) {
            await connection.rollback();
            console.error("Database Error (update assignment):", err);
            throw err;
        } finally {
            connection.release();
        }
    },
    delete: async (assignmentId) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Get Rubric ID
            const [rubricRows] = await connection.query(`SELECT rubricId FROM rubrics WHERE assignmentId = ?`, [assignmentId]);
            
            if (rubricRows.length > 0) {
                const rubricId = rubricRows[0].rubricId;
                
                // 2. Delete Rubric Content (Cells, Criteria, then Levels)
                await connection.query(`DELETE FROM rubriccells WHERE criteriaId IN (SELECT criteriaId FROM criteria WHERE rubricId = ?)`, [rubricId]);
                await connection.query(`DELETE FROM criteria WHERE rubricId = ?`, [rubricId]);
                await connection.query(`DELETE FROM levels WHERE rubricId = ?`, [rubricId]);
                
                // 3. Delete Rubric Header
                await connection.query(`DELETE FROM rubrics WHERE rubricId = ?`, [rubricId]);
            }

            // 4. Delete Files
            await connection.query(`DELETE FROM files WHERE assignmentId = ?`, [assignmentId]);

            // 5. Delete linking table entries
            await connection.query(`DELETE FROM userAssignments WHERE assignmentId = ?`, [assignmentId]);

            // 6. Delete Assignment itself
            const [result] = await connection.query(`DELETE FROM assignments WHERE assignmentId = ?`, [assignmentId]);

            await connection.commit();
            return result.affectedRows > 0;
        } catch (err) {
            await connection.rollback();
            console.error("Database Error (delete assignment):", err);
            throw err;
        } finally {
            connection.release();
        }
    },
    uploadIndividualFile: async (userId, assignmentId, fileUrl) => {
        const sql = `INSERT INTO files (fileUrl, userId, assignmentId) VALUES (?, ?, ?)`;
        const [result] = await pool.query(sql, [fileUrl, userId, assignmentId]);
        return result.insertId;
    },
    deleteIndividualFile: async (fileId) => {
        const sql = `DELETE FROM files WHERE fileId = ?`;
        const [result] = await pool.query(sql, [fileId]);
        return result.affectedRows > 0;
    },
    submitIndividualWork: async (userId, assignmentId, isSubmitted) => {
        const sql = `UPDATE userAssignments SET isSubmitted = ? WHERE userId = ? AND assignmentId = ?`;
        await pool.query(sql, [isSubmitted ? 1 : 0, userId, assignmentId]);
    },
    getAllIndividualSubmissions: async (assignmentId) => {
        const sql = `
            SELECT 
                u.userId,
                u.firstName,
                u.lastName,
                u.email,
                ua.isSubmitted,
                ua.grades,
                (SELECT GROUP_CONCAT(fileUrl) FROM files f WHERE f.userId = u.userId AND f.assignmentId = ?) as fileUrls
            FROM users u
            JOIN userAssignments ua ON u.userId = ua.userId
            WHERE ua.assignmentId = ?
        `;
        const [rows] = await pool.query(sql, [assignmentId, assignmentId]);
        return rows.map(r => ({
            ...r,
            files: r.fileUrls ? r.fileUrls.split(',').map(url => ({ fileUrl: url })) : []
        }));
    },
    gradeIndividualWork: async (userId, assignmentId, grades) => {
        const sql = `
            UPDATE userAssignments 
            SET grades = ?, 
                isSubmitted = CASE WHEN ? IS NOT NULL THEN 1 ELSE isSubmitted END 
            WHERE userId = ? AND assignmentId = ?
        `;
        await pool.query(sql, [grades, grades, userId, assignmentId]);
    }
};

export default AssignmentModel;