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
                   CASE 
                       WHEN t.progress = 100 THEN 'COMPLETED'
                       WHEN t.progress >= 50 THEN 'IN PROGRESS'
                       WHEN t.progress > 0 THEN 'AT RISK'
                       ELSE 'WAITING'
                   END as status
            FROM tasks t 
            WHERE t.groupId = ? AND t.assignmentId = ?
        `;
        const [rows] = await pool.query(sql, [groupId, assignmentId]);
        return rows;
    },

    getById: async (taskId) => {
        // Fetch task info
        const taskSql = `SELECT * FROM tasks WHERE taskId = ?`;
        const [tasks] = await pool.query(taskSql, [taskId]);
        if (tasks.length === 0) return null;
        
        const task = tasks[0];

        // Fetch associated files
        const filesSql = `SELECT * FROM files WHERE taskId = ?`;
        const [files] = await pool.query(filesSql, [taskId]);
        task.files = files;

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
        let sql = "UPDATE tasks SET isSubmitted = ? WHERE taskId = ?";
        if (isSubmitted) {
            sql = "UPDATE tasks SET isSubmitted = ?, attemptCount = attemptCount + 1 WHERE taskId = ?";
        }
        const [result] = await pool.query(sql, [isSubmitted ? 1 : 0, taskId]);
        return result.affectedRows > 0;
    }
};

export default TaskModel;
