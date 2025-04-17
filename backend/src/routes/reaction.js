const express = require('express');
const pool = require('../config/db.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // null token
    if (!token) return res.status(401).json({ message: "Not logged in" });

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        req.user = user; // userId and username will be available
        next();
    });
};

// Retrieves Leaderboard. Returns the top 10 times to beat
router.get('/leaderboard', async (req, res) => {
    console.log("\n\Masher Leaderboard Called");

    try {
        const results = await pool.query('SELECT username, reaction_time AS "reactionTime" FROM reaction_scores ORDER BY reaction_time, time LIMIT 10;');
        const leaderboard = results.rows;
        
        res.status(200).json({ leaderboard});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to retrieve leaderboard"})
    }
});

// Record game session. Frontend calculates the reaction time
// Takes in username and reaction time
router.post('/record-time', authenticateToken, async (req, res) => {
    console.log("\n\nReaction Game Recorded", req.body);

    const { reactionTime } = req.body;
    let userRank = null;

    if (!reactionTime) {
        res.status(400).json({ message: 'Username and reaction time are required.' });
    }

    const username = req.user.username;

    try {
        // Add user's time to DB
        await pool.query(`
            INSERT INTO reaction_scores (username, reaction_time) VALUES ($1, $2) 
            ON CONFLICT (username) 
            DO UPDATE SET reaction_time = LEAST(EXCLUDED.reaction_time, reaction_scores.reaction_time);
            `, [username, reactionTime]);

        const highScoreResults = await pool.query(`
            SELECT reaction_time AS "reactionTime"
            FROM reaction_scores
            WHERE username = $1
            `, [username]);

        const userRankResults = await pool.query(`
            WITH ranked AS (
                SELECT username, reaction_time,
                RANK() OVER (ORDER BY reaction_time, time) AS rank
                FROM reaction_scores
            )
            SELECT rank FROM ranked WHERE username = $1;
            `, [username]);

        // Set userRank if found, otherwise return -1
        userRank = userRankResults.rows.length > 0 ? userRankResults.rows[0].rank : -1;

        res.status(201).json({ highScore: highScoreResults.rows[0].reactionTime, rank: Number(userRank) });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to record reaction_time"})
    }
});

// GET endpoint => returns highscore and rank
router.get('/user-rank', authenticateToken, async (req, res) => {
    console.log("\n\nReaction User Rank Called");

    const username = req.user.username;

    try {
        const highScoreResults = await pool.query(`
            SELECT reaction_time AS "reactionTime"
            FROM reaction_scores
            WHERE username = $1
            `, [username]);

        const userRankResults = await pool.query(`
            WITH ranked AS (
                SELECT username, reaction_time,
                RANK() OVER (ORDER BY reaction_time, time) AS rank
                FROM reaction_scores
            )
            SELECT rank FROM ranked WHERE username = $1;
            `, [username]);

        const highScore = highScoreResults.rows.length > 0 ? Number(highScoreResults.rows[0].reactionTime) : null;
        const userRank = userRankResults.rows.length > 0 ? Number(userRankResults.rows[0].rank) : null;
        
        res.status(200).json({ highScore, rank: userRank });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to retrieve user rank"})
    }
});

// Export Reaction endpoints
module.exports = router;