import pool from '../db.js';

const LinkModel = {
    addLink: async (linkUrl, assignmentId, userId = null, groupId = null, taskId = null) => {
        try {
            const sql = `
                INSERT INTO links (linkUrl, assignmentId, userId, groupId, taskId)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(sql, [linkUrl, assignmentId, userId, groupId, taskId]);
            return result.insertId;
        } catch (err) {
            console.error("LinkModel.addLink Error:", err);
            throw err;
        }
    },

    deleteLink: async (linkId) => {
        try {
            const sql = `DELETE FROM links WHERE linkId = ?`;
            const [result] = await pool.query(sql, [linkId]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error("LinkModel.deleteLink Error:", err);
            throw err;
        }
    },

    getLinks: async (assignmentId, userId = null, groupId = null, taskId = null) => {
        try {
            let sql = `SELECT * FROM links WHERE assignmentId = ?`;
            const params = [assignmentId];

            if (taskId) {
                sql += ` AND taskId = ?`;
                params.push(taskId);
            } else if (groupId) {
                sql += ` AND groupId = ? AND taskId IS NULL`;
                params.push(groupId);
            } else if (userId) {
                sql += ` AND userId = ? AND groupId IS NULL AND taskId IS NULL`;
                params.push(userId);
            } else {
                sql += ` AND userId IS NULL AND groupId IS NULL AND taskId IS NULL`;
            }

            const [rows] = await pool.query(sql, params);
            return rows;
        } catch (err) {
            console.error("LinkModel.getLinks Error:", err);
            throw err;
        }
    }
};

export default LinkModel;
