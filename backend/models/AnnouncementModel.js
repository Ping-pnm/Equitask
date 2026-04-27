import pool from "../db.js";

const AnnouncementModel = {
    createAnnouncement: async (content, creatorId, classId) => {
        try {
            const sql = `
                INSERT INTO announcements (content, creatorId, classId)
                VALUES (?, ?, ?);
            `;

            const [announcementRes] = await pool.query(sql, [content, creatorId, classId]);
            const newAnnouncementId = announcementRes.insertId;

            return newAnnouncementId;
        } catch (err) {
            console.error("Database Error (createAnnouncement)");
        }
    },
    getAllByClassId: async (classId) => {
        try {
            const sql = `
                SELECT 
                    a.*, 
                    u.firstName, 
                    u.lastName 
                FROM announcements a
                JOIN users u ON a.creatorId = u.userId
                WHERE a.classId = ?;
            `;
            const [rows] = await pool.query(sql, [classId]);
            return rows;
        } catch (err) {
            console.error("Database Error (getAllByClassId):", err);
            throw err;
        }
    }
}

export default AnnouncementModel;