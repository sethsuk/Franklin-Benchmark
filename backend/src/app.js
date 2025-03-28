const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.js');
const reactionRoutes = require('./routes/reaction');
const masherRoutes = require('./routes/masher.js');
const mathRoutes = require('./routes/math.js');

const app = express();

// Middleware & Cookie Stuff
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', userRoutes)
app.use('/reaction', reactionRoutes);
app.use('/masher', masherRoutes);
app.use('/math', mathRoutes)

module.exports = app;