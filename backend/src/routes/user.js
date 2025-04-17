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
    console.log('\n\nAuth Google Called');

    const { idToken } = req.body;

    try {
        // Validing user's idToken with Google OAuth2
        const ticket = await client.verifyIdToken({
            idToken,
            audience: client_id,
        });

        const { email, sub: google_id } = ticket.getPayload();

        // Checks if user is in the db
        const userQuery = await pool.query('SELECT * FROM users WHERE google_id = $1', [google_id]);

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
                { google_id, email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ status: 'new_user', user: { google_id, email, username: null, id: null }, token });
        }

    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});

// POST endpoint => register new user in DB
router.post('/auth/register-username', async (req, res) => {
    console.log('\n\nRegister-username Called');

    const { google_id, username, email } = req.body;

    try {
        // Validate unique username
        const usernameQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (usernameQuery.rows.length > 0) {
            console.log('\n\nUsername already taken');
            return res.status(409).json({ message: 'Username already taken' });
        }

        // Validate unique google_id
        const googleIdQuery = await pool.query('SELECT * FROM users WHERE google_id = $1', [google_id]);

        if (googleIdQuery.rows.length > 0) {
            console.log('\n\ngoogle_id already exists');
            return res.status(409).json({ message: 'google_id already exists' });
        }

        // Insert new user to DB
        const newUserQuery = await pool.query(
            'INSERT INTO users (google_id, username, email) VALUES ($1, $2, $3) RETURNING *',
            [google_id, username, email]
        );

        const newUser = newUserQuery.rows[0];

        const token = jwt.sign(
            { google_id: newUser.google_id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
      
        res.status(201).json({ message: 'User created successfully', user: newUser, token });
    } catch (err) {
        console.error(err);
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

// GET endpoint => checks if the user is valid and verified
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ message: 'User verified', user: req.user });
});

// GET endpoint => returns how old the account is in days
router.get('/account-age', authenticateToken, async (req, res) => {
    try {
        const google_id = req.user.google_id;

        // queries DB to find the user's account age
        const result = await pool.query(`
            SELECT (CURRENT_DATE - created_at::date) AS account_age
            FROM users
            WHERE google_id = $1
            `, [google_id]);

        // No result from DB
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found'});
        }

        const { account_age } = result.rows[0];

        return res.status(200).json({ account_age });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;