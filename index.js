require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const mongo = require('./mongo');
mongo.connect();

const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

app.use(express.json());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Change this to true if using HTTPS
}));

app.use('/tasks', checkAuth, require('./routes/tasks'));
app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));

app.get('/', checkAuth, (req, res) => {
    res.sendFile(`${__dirname}/static/index.html`);
});
app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/static/login.html`);
});
app.get('/signup', (req, res) => {
    res.sendFile(`${__dirname}/static/signup.html`);
});

const PORT = 80;
app.listen(PORT, () => { console.log(`App running on http://localhost:${PORT}`) });