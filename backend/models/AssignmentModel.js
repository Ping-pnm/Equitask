import pool from "../db.js";

export const AssignmentModel =  {
    getAllByClassId: async (classId) => {
        try {
            const sql = `
                SELECT * FROM assignments a
                JOIN users u ON a.creatorId = u.userId
                WHERE classId = ?;

            `;

            const [assignmentRes] = await pool.query(sql, [classId]);
            return assignmentRes;
        } catch(err) {
            console.error("Database Error (getAllByClassId)");
        };
    }
}

export default AssignmentModel;