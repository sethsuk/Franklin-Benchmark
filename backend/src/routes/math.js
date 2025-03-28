const express = require('express');
const pool = require('../config/db.js');

const router = express.Router();

// Returns the top 10 math scores to beat
router.get('/leaderboard', async (req, res) => {
    console.log("\n\Math Leaderboard Called");

    try {
        const results = await pool.query(`
            SELECT u.username, ms.score
            FROM math_scores ms JOIN users u ON ms.username = u.username
            ORDER BY ms.score DESC, ms.time LIMIT 10;
        `);

        const leaderboard = results.rows;
        
        res.status(200).json({ leaderboard});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to retrieve leaderboard"})
    }
});

// Record game session. Frontend calculates the number of problems solved
// Takes in username and math score
router.post('/record-score', async (req, res) => {
    console.log("\n\nMath Score Recorded", req.body);

    const { username, score } = req.body;
    let userRank = null;

    if (!username || !score) {
        res.status(400).json({ message: 'Username and score are required.' });
    }

    try {
        // Add user's time to DB
        await pool.query(`
            INSERT INTO math_scores (username, score) VALUES ($1, $2) 
            ON CONFLICT (username) 
            DO UPDATE SET score = GREATEST(EXCLUDED.score, math_scores.score);
            `, [username, score]);

        const highScoreResults = await pool.query(`
            SELECT score
            FROM math_scores
            WHERE username = $1
            `, [username]);

        const userRankResults = await pool.query(`
            WITH ranked AS (
                SELECT username, score,
                RANK() OVER (ORDER BY score DESC, time) AS rank
                FROM math_scores
            )
            SELECT rank FROM ranked WHERE username = $1;
            `, [username]);

        // Set userRank if found, otherwise return -1
        userRank = userRankResults.rows.length > 0 ? userRankResults.rows[0].rank : -1;

        res.status(201).json({ highScore: highScoreResults.rows[0].score, rank: Number(userRank) });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to record score"})
    }
});


// Export Math endpoints
module.exports = router;