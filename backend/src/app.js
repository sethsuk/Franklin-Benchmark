const express = require('express');
const cors = require('cors');
const reactionRoutes = require('./routes/reaction');
const masherRoutes = require('./routes/masher.js');
const userRoutes = require('./routes/user.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/reaction', reactionRoutes);
app.use('/masher', masherRoutes);
app.use('/user', userRoutes)

module.exports = app;