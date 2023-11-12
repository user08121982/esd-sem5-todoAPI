const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const bcrypt = require('bcrypt');

const coll = mongo.getDB().collection('users');

router.post('/checkUser', async (req, res) => {
    const { username, email } = req.body;
    try {
        // Check if a user with the provided username exists
        const userByUsername = await coll.findOne({ username });
        // Check if a user with the provided email exists
        const userByEmail = await coll.findOne({ email });
        res.json({ username: userByUsername !== null, email: userByEmail !== null });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert the new user into the database
        await coll.insertOne({
            'username': username,
            'email': email,
            password: hashedPassword
        });
        res.json({ success: true, message: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete('/deleteUser', async (req, res) => {
    try {
        await mongo.getDB().collection('tasks').deleteMany({ "userId": req.session.user._id });
        await coll.deleteOne({ 'username': req.session.user.username });
        res.json({ success: true, message: 'Account deleted successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
module.exports = router;