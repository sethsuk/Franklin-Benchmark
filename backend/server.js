// server.js
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000; // Use an environment variable or default to 5000

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies (for POST/PUT requests)

// In-memory storage for sessions (for now, but consider using a database later)
const sessions = {};

// Start new game session
app.post('/reaction/start', (req, res) => {
  console.log("\n\nReaction Game Start")
  const sessionId = uuidv4();

  sessions[sessionId] = {
    bestReactionTime: null
  };

  return res.json({ sessionId });
});

// End game session. Frontend calculates the reaction time -- lower latency
app.post('/reaction/end', (req, res) => {
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


// Hello world endpoint
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
