const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory storage for sessions (for now, but consider using a database later)
const sessions = {};

// Start new game session
router.post('/start', (req, res) => {
  console.log("\n\nReaction Game Start")
  const sessionId = uuidv4();

  sessions[sessionId] = {
    bestReactionTime: null
  };

  return res.json({ sessionId });
});

// End game session. Frontend calculates the reaction time -- lower latency
router.post('/end', (req, res) => {
  console.log("\n\nReaction Game End")

  const { sessionId, reactionTime } = req.body;

  if (!sessionId || !reactionTime) {
    return res.status(400).json({ message: 'Session ID and reaction time are required.' });
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(404).json({ message: 'Session not found. Start game first.' });
  }

  if (session.bestReactionTime === null || reactionTime < session.bestReactionTime) {
    session.bestReactionTime = reactionTime;
  }

  return res.json({ 
    message: 'Reaction time recorded.', 
    bestReactionTime: session.bestReactionTime 
  });
});

// Export Reaction endpoints
module.exports = router;