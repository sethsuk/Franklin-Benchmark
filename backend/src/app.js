const express = require('express');
const cors = require('cors');
const reactionRoutes = require('./routes/reaction');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/reaction', reactionRoutes);

module.exports = app;