const express = require('express');
const pool = require('../config/db.js');

const router = express.Router();

// Middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // null token
    if (!token) return res.sendStatus(401);

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user; // userId and username will be available
        next();
    });
};

// Returns the top 10 mashes to beat
router.get('/leaderboard', async (req, res) => {
    console.log("\n\nMasher Leaderboard Called");

    try {
        const results = await pool.query('SELECT username, mashes AS "masherScore" FROM masher_scores ORDER BY mashes DESC, time LIMIT 10;');
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

    if (!username || !mashes) {
        return res.status(400).json({ message: 'Username and mashes are required.' });
    }

    try {
        // Add user's time to DB
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

// GET endpoint => returns highscore and rank
router.get('/user-rank', authenticateToken, async (req, res) => {
    console.log("\n\nMasher User Rank Called");

    const username = req.user.username;

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

        // Set userRank if found, otherwise return -1
        const userRank = userRankResults.rows.length > 0 ? userRankResults.rows[0].rank : -1;

        // Set highScore if found, otherwise return -1
        const highScore = highScoreResults.rows.length > 0 ? highScoreResults.rows[0].mashes : -1;
        
        res.status(200).json({ highScore, rank: Number(userRank) });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to retrieve user rank"})
    }
});

// Export Masher endpoints
module.exports = router;