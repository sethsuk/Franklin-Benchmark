const pool = require('./db');

async function initializeDatabase() {
    try {
        await pool.query(`
           CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                google_id VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           ) 
        `);

        await pool.query(` 
            CREATE TABLE IF NOT EXISTS reaction_scores (
                username VARCHAR(255) NOT NULL PRIMARY KEY,
                reaction_time INT NOT NULL,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS masher_scores (
                username VARCHAR(255) NOT NULL PRIMARY KEY,
                mashes INT NOT NULL,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

module.exports = initializeDatabase;