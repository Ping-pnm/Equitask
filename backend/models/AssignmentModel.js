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
            console.error("Database Error (getAllByClassId)");
        };
        }
    }

export default AssignmentModel;