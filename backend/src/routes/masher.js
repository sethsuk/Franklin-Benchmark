const express = require('express');
const pool = require('../config/db.js');

const router = express.Router();

// Returns the top 10 mashes to beat
router.get('/leaderboard', async (req, res) => {
    console.log("\n\Masher Leaderboard Called");

    try {
        const results = await pool.query('SELECT username, mashes AS "masherScore" FROM masher_scores ORDER BY mashes DESC, time LIMIT 10;');
        const leaderboard = results.rows;
        
        return res.status(200).json({ leaderboard});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to retrieve leaderboard"})
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

        res.json({ highScore: highScoreResults.rows[0].mashes, rank: Number(userRank) });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to record mashes"})
    }
});


// Export Masher endpoints
module.exports = router;