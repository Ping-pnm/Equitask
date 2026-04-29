import pool from '../db.js';

const TaskModel = {
    create: async (data) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insert into tasks
            const taskSql = `
                INSERT INTO tasks (name, details, userId, groupId, assignmentId)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [taskResult] = await connection.query(taskSql, [
                data.name, data.details, data.userId, data.groupId, data.assignmentId
            ]);
            const taskId = taskResult.insertId;

            // 2. Handle Rubrics (Optional)
            if (data.rubrics) {
                const rubricSql = `
                    INSERT INTO rubrics (title, taskId)
                    VALUES (?, ?)
                `;
                const [rubricResult] = await connection.query(rubricSql, [`Rubric for ${data.name}`, taskId]);
                const rubricId = rubricResult.insertId;

                // 3. Insert into criteria (Rows)
                const criteriaIds = [];
                if (data.rubrics.criterias) {
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
                if (data.rubrics.levels) {
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
                if (data.rubrics.cells && criteriaIds.length > 0 && levelIds.length > 0) {
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
            }

            await connection.commit();
            return taskId;
        } catch (err) {
            await connection.rollback();
            console.error("TaskModel.create Error:", err);
            throw err;
        } finally {
            connection.release();
        }
    },

    getTasksByGroupAndAssignment: async (groupId, assignmentId) => {
        const sql = `
            SELECT t.*,
                   COALESCE((SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY createdAt DESC LIMIT 1), 0) as progress,
                   CASE 
                       WHEN (SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY createdAt DESC LIMIT 1) = 100 THEN 'COMPLETED'
                       WHEN (SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY createdAt DESC LIMIT 1) >= 50 THEN 'IN PROGRESS'
                       WHEN (SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY createdAt DESC LIMIT 1) > 0 THEN 'AT RISK'
                       ELSE 'WAITING'
                   END as status
            FROM tasks t 
            WHERE t.groupId = ? AND t.assignmentId = ?
        `;
        const [rows] = await pool.query(sql, [groupId, assignmentId]);
        return rows;
    },

    getById: async (taskId) => {
        // Fetch task info with student and group names, and aggregate attempt stats
        const taskSql = `
            SELECT t.*, 
                   CONCAT(u.firstName, ' ', u.lastName) as studentName,
                   g.groupName,
                   COALESCE((SELECT progress FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1), 0) as progress,
                   (SELECT createdAt FROM attemptLog al WHERE al.taskId = t.taskId ORDER BY al.createdAt DESC LIMIT 1) as lastAttemptAt,
                   (SELECT COUNT(*) FROM attemptLog al WHERE al.taskId = t.taskId) as attempt
            FROM tasks t
            LEFT JOIN users u ON t.userId = u.userId
            LEFT JOIN \`groups\` g ON t.groupId = g.groupId
            WHERE t.taskId = ?
        `;
        const [tasks] = await pool.query(taskSql, [taskId]);
        if (tasks.length === 0) return null;
        
        const task = tasks[0];

        // Fetch associated files (where userId is NULL)
        const filesSql = `SELECT * FROM files WHERE taskId = ? AND assignmentId = ? AND userId IS NULL`;
        const [files] = await pool.query(filesSql, [taskId, task.assignmentId]);
        task.files = files;

        // Fetch attempt logs for activity table
        const logsSql = `SELECT * FROM attemptLog WHERE taskId = ? ORDER BY createdAt DESC`;
        const [logs] = await pool.query(logsSql, [taskId]);
        task.logs = logs;

        // --- FETCH RUBRIC DATA ---
        // 1. Try to find rubric for THIS task
        let rubricSql = `SELECT * FROM rubrics WHERE taskId = ?`;
        let [rubrics] = await pool.query(rubricSql, [taskId]);

        // 2. Fallback to assignment rubric if not found
        if (rubrics.length === 0) {
            rubricSql = `SELECT * FROM rubrics WHERE assignmentId = ?`;
            [rubrics] = await pool.query(rubricSql, [task.assignmentId]);
        }

        task.rubric = rubrics[0] || null;
        task.criteria = [];
        task.levels = [];
        task.rubricCells = [];

        if (task.rubric) {
            const rubricId = task.rubric.rubricId;
            
            // Fetch Criteria
            const criteriaSql = `SELECT * FROM criteria WHERE rubricId = ? ORDER BY sort_order ASC`;
            const [criteria] = await pool.query(criteriaSql, [rubricId]);
            task.criteria = criteria;

            // Fetch Levels
            const levelsSql = `SELECT * FROM levels WHERE rubricId = ? ORDER BY sort_order ASC`;
            const [levels] = await pool.query(levelsSql, [rubricId]);
            task.levels = levels;

            // Fetch Cells
            if (criteria.length > 0 && levels.length > 0) {
                const criteriaIds = criteria.map(c => c.criteriaId);
                const levelIds = levels.map(l => l.levelId);
                const cellsSql = `SELECT * FROM rubriccells WHERE criteriaId IN (?) AND levelId IN (?)`;
                const [cellRows] = await pool.query(cellsSql, [criteriaIds, levelIds]);

                // Construct 2D array
                const rubricCells = Array.from({ length: criteriaIds.length }, () => Array(levelIds.length).fill(''));
                cellRows.forEach(row => {
                    const rIndex = criteriaIds.indexOf(row.criteriaId);
                    const cIndex = levelIds.indexOf(row.levelId);
                    if (rIndex !== -1 && cIndex !== -1) rubricCells[rIndex][cIndex] = row.content;
                });
                task.rubricCells = rubricCells;
            }
        }

        return task;
    },

    uploadTaskFile: async (taskId, groupId, assignmentId, fileUrl) => {
        const sql = `
            INSERT INTO files (fileUrl, taskId, groupId, assignmentId)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [fileUrl, taskId, groupId, assignmentId]);
        return result.insertId;
    },

    deleteFile: async (fileId) => {
        const sql = "DELETE FROM files WHERE fileId = ?";
        const [result] = await pool.query(sql, [fileId]);
        return result.affectedRows > 0;
    },

    submitTask: async (taskId, isSubmitted) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Update isSubmitted status
            const updateSql = "UPDATE tasks SET isSubmitted = ? WHERE taskId = ?";
            await connection.query(updateSql, [isSubmitted ? 1 : 0, taskId]);

            let progress = 0;
            let selections = [];

            // 2. If submitting, generate random rubric selections (AI Simulation)
            if (isSubmitted) {
                // Fetch current rubric, criteria and levels to perform randomization and calculation
                const task = await TaskModel.getById(taskId); // This now includes criteria and levels
                if (task && task.criteria && task.levels) {
                    const sortedLevels = [...task.levels].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                    const totalLevels = sortedLevels.length;
                    const divisor = totalLevels > 1 ? (totalLevels - 1) : 1;

                    let totalPoints = 0;

                    for (const criteria of task.criteria) {
                        const randomIdx = Math.floor(Math.random() * totalLevels);
                        const selectedLevel = sortedLevels[randomIdx];
                        
                        selections.push({ criteriaId: criteria.criteriaId, levelId: selectedLevel.levelId });

                        // Update criteria table with selection
                        const updateCriteriaSql = "UPDATE criteria SET selectedLevelId = ? WHERE criteriaId = ?";
                        await connection.query(updateCriteriaSql, [selectedLevel.levelId, criteria.criteriaId]);

                        // Calculate score for this row
                        const rowScore = ((totalLevels - 1 - randomIdx) / divisor) * 100;
                        totalPoints += rowScore;
                    }

                    const numCriteria = task.criteria.length;
                    progress = numCriteria > 0 ? Math.round(totalPoints / numCriteria) : 0;
                }

                // 3. Add to attemptLog
                const logSql = `
                    INSERT INTO attemptLog (taskId, progress, message)
                    VALUES (?, ?, ?)
                `;
                await connection.query(logSql, [taskId, progress, null]);
            } else {
                // If unsubmitting, optionally clear selections (depends on desired behavior)
                // For now, we'll just keep them but set isSubmitted to 0
            }

            await connection.commit();
            return { success: true, progress, selections };
        } catch (err) {
            await connection.rollback();
            console.error("TaskModel.submitTask Error:", err);
            throw err;
        } finally {
            connection.release();
        }
    },

    updateCriteriaSelections: async (selections) => {
        // selections is an array of { criteriaId, levelId }
        console.log("TaskModel.updateCriteriaSelections: starting update for", selections.length, "items");
        const sql = "UPDATE criteria SET selectedLevelId = ? WHERE criteriaId = ?";
        for (const sel of selections) {
            console.log(`Updating criteria ${sel.criteriaId} with level ${sel.levelId}`);
            const [result] = await pool.query(sql, [sel.levelId, sel.criteriaId]);
            console.log(`Update result for criteria ${sel.criteriaId}: ${result.affectedRows} rows affected`);
        }
        return true;
    }
};

export default TaskModel;
