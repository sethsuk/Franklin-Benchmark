const express = require('express');
const cors = require('cors');
const reactionRoutes = require('./routes/reaction');
const masherRoutes = require('./routes/masher');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/reaction', reactionRoutes);
app.use('/masher', masherRoutes);

module.exports = app;