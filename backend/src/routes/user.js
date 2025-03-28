const express = require('express');
const pool = require('../config/db.js');
const { OAuth2Client } = require('google-auth-library');
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
            res.json({ status: 'existing_user', user: userQuery.rows[0] });
        } else {
            // New user
            res.json({ status: 'new_user', googleId, email });
        }

        // Generate a JWT token for persistent authentication
        // const token = jwt.sign(
        //     { id: user.id, googleId: user.google_id, email: user.email },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '1h' }
        // );

    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});

// POST endpoint => register new user in DB
router.post('/auth/register-username', async (req, res) => {
    console.log('\n\nRegister-username Called');

    const { googleId, username, email, name } = req.body;

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
        await pool.query(
            'INSERT INTO users (google_id, username, email) VALUES ($1, $2, $3)',
            [googleId, username, email]
          );
      
        res.status(201).json({ message: 'User created successfully', username });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Database error' });
    }
});


module.exports = router;