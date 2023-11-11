const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const bcrypt = require('bcrypt');

const coll = mongo.getDB().collection('users');

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if a user with the provided username exists
        const user = await coll.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password.' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.user = user;
            res.json({ success: true, message: 'Authentication successful.' });
        } else {
            res.json({ success: false, message: 'Invalid email or password.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/user', async (req, res) => {
    res.json(req.session.user);
});

router.patch('/editProfile', async (req, res) => {
    try {
        for ([key, value] of Object.entries(req.body)) {
            req.session.user[key] = value;
        }
        await coll.updateOne({ "username": req.session.user.username }, { $set: req.body });
        res.json({ success: true, message: 'Profile updated.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/changePassword', async (req, res) => {
    const { password, newPassword } = req.body;
    try {
        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, req.session.user.password);

        if (passwordMatch) {
            req.session.user.password = await bcrypt.hash(newPassword, 10);
            await coll.updateOne({ "username": req.session.user.username }, { $set: { "password": req.session.user.password } });
            res.json({ code: 1, message: 'Password changed successful.' });
        } else {
            res.json({ code: 2, message: 'Wrong password!' });
        }
    } catch (err) {
        res.status(500).json({ code: 3, message: err.message });
    }
});

router.post('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ success: false, message: 'Logout failed.' });
        } else {
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logout successful.' });
        }
    });
});
module.exports = router;