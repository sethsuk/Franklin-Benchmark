const express = require('express');
const db = require('../config/db.js');

const router = express.Router();

// Start new game session. Returns the top 10 times to beat
router.post('/leaderboard', async (req, res) => {
    console.log("\n\Reaction Leaderboard Called");

    try {
        const [leaderboard] = await db.query('SELECT username, reaction_time FROM reaction_times ORDER BY reaction_time LIMIT 10;');

        return res.json({ leaderboard });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to start reaction_time"})
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
        const [leaderboard] = await db.query('SELECT reaction_time FROM reaction_times ORDER BY reaction_time DESC LIMIT 10;');

        if (leaderboard.length < 10 || reactionTime < leaderboard[leaderboard.length - 1].reactionTime) {
            await db.query('INSERT INTO reaction_times (username, reaction_time) VALUES (?, ?)', [username, reactionTime]);
        }

        res.json({ message: 'Reaction time recorded.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to record reaction_time"})
    }
});

// Export Reaction endpoints
module.exports = router;