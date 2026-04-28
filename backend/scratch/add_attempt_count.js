import pool from '../db.js';

async function setup() {
    try {
        console.log("Checking for attemptCount column...");
        const [cols] = await pool.query("SHOW COLUMNS FROM tasks LIKE 'attemptCount'");
        
        if (cols.length === 0) {
            console.log("Adding 'attemptCount' to 'tasks' table...");
            await pool.query("ALTER TABLE tasks ADD COLUMN attemptCount INT DEFAULT 0");
        } else {
            console.log("'attemptCount' already exists.");
        }
        
        console.log("Schema update complete.");
        process.exit(0);
    } catch (err) {
        console.error("Schema Setup Error:", err);
        process.exit(1);
    }
}

setup();
