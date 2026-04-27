import pool from '../db.js';

const AssignmentModel = {
    getAllByClassId: async (classId) => {
        try {
            const sql = `
                SELECT a.*, u.firstName, u.lastName 
                FROM assignments a
                JOIN users u ON a.creatorId = u.userId
                WHERE a.classId = ?
                ORDER BY a.dueDate ASC;
            `;

            const [assignmentRes] = await pool.query(sql, [classId]);
            return assignmentRes;
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
                    isGroupWork, creatorId, classId, isGraded, isSubmitted
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)
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
            if (data.rubrics && data.rubrics.criterias) {
                const criteriaSql = `
                    INSERT INTO criteria (title, sort_order, rubricId)
                    VALUES (?, ?, ?)
                `;
                for (let i = 0; i < data.rubrics.criterias.length; i++) {
                    const criteriaTitle = data.rubrics.criterias[i];
                    if (criteriaTitle) {
                        await connection.query(criteriaSql, [criteriaTitle, i, rubricId]);
                    }
                }
            }

            // 4. Insert into levels (Columns)
            // Note: Schema doesn't show rubricId for levels, but we insert them with sort_order
            if (data.rubrics && data.rubrics.levels) {
                const levelsSql = `
                    INSERT INTO levels (title, sort_order)
                    VALUES (?, ?)
                `;
                for (let i = 0; i < data.rubrics.levels.length; i++) {
                    const levelTitle = data.rubrics.levels[i];
                    if (levelTitle) {
                        await connection.query(levelsSql, [levelTitle, i]);
                    }
                }
            }

            // 5. Handle Files (using existing files table logic)
            if (data.files && data.files.length > 0) {
                const fileSql = `
                    INSERT INTO files (fileUrl, assignmentId)
                    VALUES (?, ?)
                `;
                for (const file of data.files) {
                    await connection.query(fileSql, [file.fileUrl, assignmentId]);
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
    }
};

export default AssignmentModel;