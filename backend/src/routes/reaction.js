const express = require('express');
const pool = require('../config/db.js');

const router = express.Router();

// Start new game session. Returns the top 10 times to beat
router.get('/leaderboard', async (req, res) => {
    console.log("\n\Reaction Leaderboard Called");

    const username = req.query.username;
    let userRank = null;

    try {
        const results = await pool.query('SELECT username, reaction_time AS "reactionTime" FROM reaction_scores ORDER BY reaction_time, time LIMIT 10;');
        const leaderboard = results.rows;

        if (username) {
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
        } else {
            userRank = -1;
        }
        
        return res.status(200).json({ leaderboard, rank: Number(userRank) });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to retrieve leaderboard"})
    }
});

// Record game session. Frontend calculates the reaction time
// Takes in username and reaction time
router.post('/record-time', async (req, res) => {
    console.log("\n\nReaction Game Recorded", req.body);

    const { username, reactionTime } = req.body;

    if (!username || !reactionTime) {
        return res.status(400).json({ message: 'Username and reaction time are required.' });
    }

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


        res.json({ highScore: highScoreResults.rows[0].reactionTime});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to record reaction_time"})
    }
});

// Export Reaction endpoints
module.exports = router;