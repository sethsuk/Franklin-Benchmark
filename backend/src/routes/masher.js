const express = require('express');
const pool = require('../config/db.js');

const router = express.Router();

// Returns the top 10 mashes to beat
router.get('/leaderboard', async (req, res) => {
    console.log("\n\nMasher Leaderboard Called");

    try {
        const results = await pool.query('SELECT username, mashes FROM masher_scores ORDER BY mashes DESC, time LIMIT 10;');
        const leaderboard = results.rows;
        
        res.status(200).json({ leaderboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to retrieve leaderboard"})
    }
});

// Record game session. Frontend calculates the number of mashes
// Takes in username and masherScore
router.post('/record-mashes', async (req, res) => {
    console.log("\n\nMasher Game Recorded", req.body);

    const { username, mashes } = req.body;

    let userRank = null;

    if (!username || mashes === undefined) {
        return res.status(400).json({ message: 'Username and mashes are required.' });
    }

    try {
        // Ensure user exists (create if not)
        await pool.query(`
            INSERT INTO users (username) VALUES ($1)
            ON CONFLICT (username) DO NOTHING;
        `, [username]);

        // Add user's mashes to DB
        await pool.query(`
            INSERT INTO masher_scores (username, mashes) VALUES ($1, $2) 
            ON CONFLICT (username) 
            DO UPDATE SET mashes = GREATEST(EXCLUDED.mashes, masher_scores.mashes);
            `, [username, mashes]);

        const highScoreResults = await pool.query(`
            SELECT mashes
            FROM masher_scores
            WHERE username = $1
            `, [username]);


        const userRankResults = await pool.query(`
            WITH ranked AS (
                SELECT username, mashes,
                RANK() OVER (ORDER BY mashes DESC, time) AS rank
                FROM masher_scores
            )
            SELECT rank FROM ranked WHERE username = $1;
            `, [username]);

        // Set userRank if found, otherwise return -1
        userRank = userRankResults.rows.length > 0 ? userRankResults.rows[0].rank : -1;

        res.status(201).json({ highScore: highScoreResults.rows[0].mashes, rank: Number(userRank) });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to record mashes"})
    }
});

// GET endpoint => returns highscore and rank for a username
router.get('/user-rank/:username', async (req, res) => {
    console.log("\n\nMasher User Rank Called");

    const { username } = req.params;

    try {
        const highScoreResults = await pool.query(`
            SELECT mashes
            FROM masher_scores
            WHERE username = $1
            `, [username]);

        const userRankResults = await pool.query(`
            WITH ranked AS (
                SELECT username, mashes,
                RANK() OVER (ORDER BY mashes DESC, time) AS rank
                FROM masher_scores
            )
            SELECT rank FROM ranked WHERE username = $1;
            `, [username]);

        const highScore = highScoreResults.rows.length > 0 ? Number(highScoreResults.rows[0].mashes) : null;
        const userRank = userRankResults.rows.length > 0 ? Number(userRankResults.rows[0].rank) : null;
        
        res.status(200).json({ highScore, rank: userRank });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to retrieve user rank"})
    }
});

// Export Masher endpoints
module.exports = router;