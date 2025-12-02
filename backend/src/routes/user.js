const express = require('express');
const pool = require('../config/db.js');

require('dotenv').config();

const router = express.Router();

// POST endpoint => register or get user by username
router.post('/register', async (req, res) => {
    console.log('\n\nRegister Username Called');

    const { username } = req.body;

    if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'Username is required' });
    }

    const trimmedUsername = username.trim();

    try {
        // Check if username already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [trimmedUsername]);

        if (existingUser.rows.length > 0) {
            // User exists, return the user
            const user = existingUser.rows[0];
            return res.json({ status: 'existing_user', user });
        }

        // Create new user
        const newUserQuery = await pool.query(
            'INSERT INTO users (username) VALUES ($1) RETURNING *',
            [trimmedUsername]
        );

        const newUser = newUserQuery.rows[0];
        res.status(201).json({ status: 'new_user', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// GET endpoint => check if username exists
router.get('/check/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            res.json({ exists: true, user: result.rows[0] });
        } else {
            res.json({ exists: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// GET endpoint => returns how old the account is in days
router.get('/account-age/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // queries DB to find the user's account age
        const result = await pool.query(`
            SELECT (CURRENT_DATE - created_at::date) AS account_age
            FROM users
            WHERE username = $1
            `, [username]);

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