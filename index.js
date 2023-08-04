const express = require('express');
const path = require('path');
const app = express();
const mongo = require('./mongo');
mongo.connect();

app.use(express.json());
app.use('/tasks', require('./routes/tasks'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

const PORT = 80;
app.listen(PORT, () => { console.log(`App running on http://localhost:${PORT}`) });