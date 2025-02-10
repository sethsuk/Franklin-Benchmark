const express = require('express');
const pool = require('../config/db.js');

const router = express.Router();

// Start new game session. Returns the top 10 times to beat
router.post('/leaderboard', async (req, res) => {
    console.log("\n\Reaction Leaderboard Called");

    try {
        const results = await pool.query('SELECT username, reaction_time FROM reaction_times ORDER BY reaction_time LIMIT 10;');
        const leaderboard = results.rows;

        return res.json({ leaderboard });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to retrieve leaderboard"})
    }
});

// Record game session. Frontend calculates the reaction time
// Takes in username and reaction time
router.post('/record-time', async (req, res) => {
    console.log("\n\nReaction Game Recorded");

    const { username, reactionTime } = req.body;

    if (!username || !reactionTime) {
        return res.status(400).json({ message: 'Username and reaction time are required.' });
    }

    try {
        const results = await pool.query('SELECT username, reaction_time FROM reaction_times ORDER BY reaction_time LIMIT 10;');
        const leaderboard = results.rows;

        if (leaderboard.length < 10 || reactionTime < leaderboard[leaderboard.length - 1].reactionTime) {
            await pool.query('INSERT INTO reaction_times (username, reaction_time) VALUES ($1, $2)', [username, reactionTime]);
        }

        res.json({ message: 'Reaction time recorded.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to record reaction_time"})
    }
});

// Export Reaction endpoints
module.exports = router;