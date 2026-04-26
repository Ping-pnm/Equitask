import pool from '../db.js';

const ClassModel = {
    getAllClasses: async (userId) => {
        const sql = `
            SELECT 
                e.userId,
                c.classId, 
                c.title,
                c.section, 
                c.subject
            FROM 
                enrollments e
            JOIN 
                classes c ON e.classId = c.classId
            WHERE 
                e.userId = ?;
        `;

        const [res] = await pool.query(sql, [userId]);
        return res;
    }
};

export default ClassModel;