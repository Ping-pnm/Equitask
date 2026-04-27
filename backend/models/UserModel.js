import pool from '../db.js';

const UserModel = {
    findByEmail: async (email) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(sql, [email]);
        return rows.length > 0 ? rows[0] : null;
    },

    createUser: async (firstName, lastName, email, passwordHash) => {
        const sql = 'INSERT INTO users (firstName, lastName, email, passwordHash) VALUES (?, ?, ?, ?)';
        const [res] = await pool.query(sql, [firstName, lastName, email, passwordHash]);
        return res.insertId;
    },

    getLeaders: async (classId) => {
        try {
            const sql = `
                SELECT 
                    u.userId, 
                    u.email, 
                    u.firstName, 
                    u.lastName, 
                    o.classId
                FROM 
                    users u
                JOIN 
                    owners o ON u.userId = o.userId
                WHERE 
                    o.classId = ?;
            `;

            const [res] = await pool.query(sql, [classId]);
            return res;
        } catch(err) {
            console.error("Database Error (getLeaders):", err);
            throw err;
        }  
    },

    getMembers: async (classId) => {
        try {
            const sql = `
                SELECT 
                    u.userId, 
                    u.email, 
                    u.firstName, 
                    u.lastName, 
                    e.classId
                FROM 
                    users u
                JOIN 
                    enrollments e ON u.userId = e.userId
                WHERE 
                    e.classId = ?;
            `;

            const [res] = await pool.query(sql, [classId]);
            return res;
        } catch(err) {
            console.error("Database Error (getMembers):", err);
            throw err;
        }  
    },

    removeMemberFromClass: async (userId, classId) => {
        try {
            // Remove from both potential roles
            const sqlEnrollment = `DELETE FROM enrollments WHERE userId = ? AND classId = ?`;
            const sqlOwner = `DELETE FROM owners WHERE userId = ? AND classId = ?`;
            
            await pool.query(sqlEnrollment, [userId, classId]);
            await pool.query(sqlOwner, [userId, classId]);
            
            return true;
        } catch (err) {
            console.error("Database Error (removeMemberFromClass):", err);
            throw err;
        }
    }
};

export default UserModel;