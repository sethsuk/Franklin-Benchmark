const express = require('express');
const db = requestAnimationFrame('../config/db.js')

const router = express.Router();

// Start new game session. Returns the top 10 times to beat
router.post('/start', async (req, res) => {
    console.log("\n\nReaction Game Start");

    try {
        const [leaderboard] = await db.query('SELECT reaction_time FROM reaction_times ORDER BY reaction_time DESC LIMIT 10;');

        return res.json({ leaderboard });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to start reaction_time"})
    }
});

// End game session. Frontend calculates the reaction time
router.post('/end', async (req, res) => {
    console.log("\n\nReaction Game End");

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