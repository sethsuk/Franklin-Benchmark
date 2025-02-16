const express = require('express');
const pool = require('../config/db.js');

const router = express.Router(); // ✅ Correctly defining router

router.post('/record-time', async (req, res) => {
    console.log("\n\nReaction Game Recorded");

    const { username, reactionTime } = req.body;

    if (!username || !reactionTime) {
        return res.status(400).json({ message: 'Username and reaction time are required.' });
    }

    try {
        // ✅ Get the current top 10 leaderboard
        const results = await pool.query(
            "SELECT id, username, reaction_time FROM reaction_times ORDER BY reaction_time ASC"
        );
        const leaderboard = results.rows;

        if (leaderboard.length >= 10) {
            const slowestTime = leaderboard[leaderboard.length - 1]; // Get the slowest time

            // ✅ If the new reaction time is faster, replace the slowest time
            if (reactionTime < slowestTime.reaction_time) {
                await pool.query("DELETE FROM reaction_times WHERE id = $1", [slowestTime.id]);
                console.log(`✅ Deleted slowest score (${slowestTime.reaction_time} ms) to insert ${reactionTime} ms`);
            } else {
                console.log(`❌ ${reactionTime} ms is not faster than the slowest (${slowestTime.reaction_time} ms)`);
                return res.json({ message: "Your reaction time is not in the top 10." });
            }
        }

        // ✅ Insert new reaction time
        await pool.query("INSERT INTO reaction_times (username, reaction_time) VALUES ($1, $2)", 
            [username, reactionTime]);

        // ✅ Fetch the updated leaderboard
        const updatedResults = await pool.query(
            "SELECT username, reaction_time FROM reaction_times ORDER BY reaction_time ASC LIMIT 10;"
        );
        console.log("✅ Updated Leaderboard:", updatedResults.rows);

        res.json({ message: "Reaction time recorded.", leaderboard: updatedResults.rows });
    } catch (error) {
        console.error("Error recording reaction time:", error);
        return res.status(500).json({ error: "Failed to record reaction time" });
    }
});

router.post('/leaderboard', async (req, res) => {
    console.log("\nReaction Leaderboard Called");

    try {
        const results = await pool.query(
            "SELECT username, reaction_time FROM reaction_times ORDER BY reaction_time ASC LIMIT 10;"
        );
        return res.json({ leaderboard: results.rows });
    } catch (error) {
        console.error("Error retrieving leaderboard:", error);
        return res.status(500).json({ error: "Failed to retrieve leaderboard" });
    }
});

// ✅ Move this to the bottom AFTER defining all routes!
module.exports = router;