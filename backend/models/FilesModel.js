import pool from "../db.js";

const FilesModel = {
    AttachFilesToAnnouncement: async (announcementId, files) => {
        try {
            if (!files || files.length === 0) return;

            // 1. Create placeholders like "(?, ?), (?, ?)" based on the number of files
            const placeholders = files.map(() => "(?, ?)").join(", ");

            const sql = `
                INSERT INTO files (fileUrl, announcementId)
                VALUES ${placeholders}
            `;

            // 2. Flatten all file data into a single array: [path1, id, path2, id, ...]
            const flattenedValues = [];
            for (const file of files) {
                flattenedValues.push(file.path, announcementId);
            }

            // 3. Send the query only once with the flattened data
            await pool.query(sql, flattenedValues);

            return true;
        } catch (err) {
            console.error("Database Error (AttachFilesToAnnouncement):", err);
            throw err;
        }
    },
    getAnnouncementFiles: async (announcementId) => {
        try {
            const sql = `
                SELECT * FROM files
                WHERE announcementId = ?
            `;

            const [res] = await pool.query(sql, [announcementId]);
            return res;
        } catch (err) {
            console.error("Database Error (getAnnouncementFiles):", err);
            throw err;
        }
    },
    deleteFile: async (fileId) => {
        try {
            const sql = "DELETE FROM files WHERE fileId = ?;";
            await pool.query(sql, [fileId]);
        } catch (err) {
            console.error("Database Error (deleteFile):", err);
            throw err;
        }
    }
}

export default FilesModel;