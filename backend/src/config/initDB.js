const pool = require('./db');

async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();

        // Create the reaction_times table if it doesn't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS reaction_times (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username varchar(255) NOT NULL,
            reaction_time INT NOT NULL,
            time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Database initialized successfully.");
        connection.release();
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

module.exports = initializeDatabase;