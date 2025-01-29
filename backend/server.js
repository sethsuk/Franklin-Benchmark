// server.js
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

dotenv.config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000; // Use an environment variable or default to 5000

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies (for POST/PUT requests)

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
