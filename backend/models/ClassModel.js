import pool from '../db.js';

const ClassModel = {
    getAllClasses: async (userId) => {
        try {
            const sql = `
                SELECT 
                    uc.userId,
                    MIN(uc.role) AS role,
                    c.classId, 
                    c.title,
                    c.section, 
                    c.subject
                FROM (
                    SELECT userId, classId, 'member' AS role FROM enrollments WHERE userId = ?
                    UNION
                    SELECT userId, classId, 'leader' AS role FROM owners WHERE userId = ?
                ) AS uc
                JOIN 
                    classes c ON uc.classId = c.classId
                GROUP BY uc.userId, c.classId;
            `;

            const [res] = await pool.query(sql, [userId, userId]);
            return res;
        } catch(err) {
            console.error("Database Error (getAllClasses):", err);
            throw err;
        }
    },
    createClass: async (userId, title, section, subject) => {
        try {
            const classSql = `
                INSERT INTO classes (title, section, subject)
                VALUES (?, ?, ?);    
            `;
            const [classRes] = await pool.query(classSql, [title, section, subject]);
            const newClassId = classRes.insertId;

            const ownerSql = `
                INSERT INTO owners (userId, classId)
                VALUES (?, ?);
            `;
            await pool.query(ownerSql, [userId, newClassId]);
            
            const enrollmentSql = `
                INSERT INTO enrollments (userId, classId)
                VALUES (?, ?);
            `;

            await pool.query(enrollmentSql, [userId, newClassId]);

            return newClassId;
        } catch (err) {
            console.error("Database Error (createClass):", err);
            throw err;
        }
    } 
};

export default ClassModel;