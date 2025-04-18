const pool = require('./db');

async function initializeDatabase() {
    try {
        // await pool.query(`
        //    CREATE TABLE IF NOT EXISTS users (
        //         id SERIAL PRIMARY KEY,
        //         google_id VARCHAR(255) UNIQUE NOT NULL,
        //         username VARCHAR(255) UNIQUE NOT NULL,
        //         email VARCHAR(255) UNIQUE NOT NULL,
        //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        //    ) 
        // `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                 google_id VARCHAR(255) PRIMARY KEY,
                 username VARCHAR(255) UNIQUE NOT NULL,
                 email VARCHAR(255) UNIQUE NOT NULL,
                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) 
         `);

        await pool.query(` 
            CREATE TABLE IF NOT EXISTS reaction_scores (
                username VARCHAR(255) NOT NULL PRIMARY KEY,
                reaction_time INT NOT NULL,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (username) REFERENCES users(username)
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS masher_scores (
                username VARCHAR(255) NOT NULL PRIMARY KEY,
                mashes INT NOT NULL,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (username) REFERENCES users(username)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS math_scores (
                username VARCHAR(255) NOT NULL PRIMARY KEY,
                score INT NOT NULL,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (username) REFERENCES users(username)
            )    
        `);

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

module.exports = initializeDatabase;