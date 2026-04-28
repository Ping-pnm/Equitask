import pool from '../db.js';

const AssignmentModel = {
    getAllByClassId: async (classId, userId) => {
        try {
            const sql = `
                SELECT 
                    a.*, 
                    u.firstName, u.lastName,
                    COALESCE(ua.isSubmitted, g_info.isSubmitted, 0) as isSubmitted,
                    COALESCE(ua.grades, g_info.grades) as grades,
                    g_info.groupId,
                    g_info.groupName,
                    g_info.groupProgress,
                    g_info.members
                FROM assignments a
                JOIN users u ON a.creatorId = u.userId
                LEFT JOIN userAssignments ua ON a.assignmentId = ua.assignmentId AND ua.userId = ?
                LEFT JOIN (
                    SELECT 
                        m.userId as current_user_id,
                        g.groupId,
                        g.groupName,
                        g.assignmentId,
                        g.isSubmitted,
                        g.grades,
                        (SELECT AVG(t.progress) FROM tasks t WHERE t.groupId = g.groupId AND t.assignmentId = g.assignmentId) as groupProgress,
                        (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'userId', m2.userId,
                                    'name', CONCAT(u2.firstName, ' ', u2.lastName),
                                    'progress', (SELECT COALESCE(AVG(t2.progress), 0) FROM tasks t2 WHERE t2.userId = m2.userId AND t2.groupId = g.groupId AND t2.assignmentId = g.assignmentId)
                                )
                            )
                            FROM memberships m2
                            JOIN users u2 ON m2.userId = u2.userId
                            WHERE m2.groupId = g.groupId
                        ) as members
                    FROM memberships m
                    JOIN groups g ON m.groupId = g.groupId
                ) g_info ON a.assignmentId = g_info.assignmentId AND g_info.current_user_id = ?
                WHERE a.classId = ?
                ORDER BY a.createdAt DESC;
            `;

            const [assignmentRes] = await pool.query(sql, [userId, userId, classId]);
            
            // Parse members JSON string if necessary
            return assignmentRes.map(item => ({
                ...item,
                members: typeof item.members === 'string' ? JSON.parse(item.members) : (item.members || [])
            }));
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
                // If individual, link all students in class to this assignment
                const enrollmentSql = `SELECT userId FROM enrollments WHERE classId = ?`;
                const [students] = await connection.query(enrollmentSql, [data.classId]);
                
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
                        JOIN groups g ON m.groupId = g.groupId
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

            // 6. Get Files
            const fileSql = `SELECT * FROM files WHERE assignmentId = ?`;
            const [files] = await pool.query(fileSql, [assignmentId]);

            return {
                ...assignment,
                rubric: rubrics[0] || null,
                criteria,
                levels,
                rubricCells,
                files
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
    }
};

export default AssignmentModel;