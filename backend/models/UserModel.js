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
    }
};

export default UserModel;