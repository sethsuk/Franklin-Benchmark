const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const reactionRoutes = require('./routes/reaction');
const masherRoutes = require('./routes/masher.js');
const userRoutes = require('./routes/user.js');

const app = express();

// Middleware & Cookie Stuff
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/reaction', reactionRoutes);
app.use('/masher', masherRoutes);
app.use('/user', userRoutes)

module.exports = app;