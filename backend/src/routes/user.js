const express = require('express');
const pool = require('../config/db.js');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const client_id = process.env.CLIENT_ID;
const router = express.Router();
const client = new OAuth2Client(client_id);

// POST endpoint => authenticate the user
router.post('/auth/google', async (req, res) => {
    console.log('\n\Auth Google Called');

    const { idToken } = req.body;

    try {
        // Validing user's idToken with Google OAuth2
        const ticket = await client.verifyIdToken({
            idToken,
            audience: client_id,
        });

        const { email, sub: googleId } = ticket.getPayload();

        // Checks if user is in the db
        const userQuery = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);

        if (userQuery.rows.length > 0) {
            // User exists
            const user = userQuery.rows[0];

            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({ status: 'existing_user', user, token });
        } else {
            // New user
            const token = jwt.sign(
                { googleId, email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ status: 'new_user', googleId, email, token });
        }

    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});

// POST endpoint => register new user in DB
router.post('/auth/register-username', async (req, res) => {
    console.log('\n\nRegister-username Called');

    const { googleId, username, email } = req.body;

    try {
        // Validate unique username
        const usernameQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (usernameQuery.rows.length > 0) {
            console.log('\n\nUsername already taken');
            return res.status(409).json({ message: 'Username already taken' });
        }

        // Validate unique googleId
        const googleIdQuery = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);

        if (googleIdQuery.rows.length > 0) {
            console.log('\n\nGoogleId already exists');
            return res.status(409).json({ message: 'GoogleId already exists' });
        }

        // Insert new user to DB
        const newUserQuery = await pool.query(
            'INSERT INTO users (google_id, username, email) VALUES ($1, $2, $3) RETURNING *',
            [googleId, username, email]
        );

        const newUser = newUserQuery.rows[0];

        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
      
        res.status(201).json({ message: 'User created successfully', username, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // null token
    if (!token) return res.sendStatus(401);

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // userId and username will be available
        next();
    });
};

// Example protected route
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ message: 'User verified', user: req.user });
});


module.exports = router;