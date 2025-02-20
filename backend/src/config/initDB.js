const pool = require('./db');

async function initializeDatabase() {
    try {
        await pool.query(` 
            CREATE TABLE IF NOT EXISTS reaction_scores (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                reaction_time INT NOT NULL,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

module.exports = initializeDatabase;