import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });
import pool from '../backend/db.js';

async function migrate() {
    try {
        console.log("Checking for fileName column...");
        const [columns] = await pool.query("SHOW COLUMNS FROM files LIKE 'fileName'");
        
        if (columns.length === 0) {
            console.log("Adding fileName column to files table...");
            await pool.query("ALTER TABLE files ADD COLUMN fileName VARCHAR(255) AFTER fileUrl");
            console.log("Column added successfully.");
        } else {
            console.log("fileName column already exists.");
        }
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        process.exit();
    }
}

migrate();
