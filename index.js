const express = require('express');
const app = express();
const mongo = require('./mongo');
mongo.connect();

const tasksRouter = require('./routes/tasks');
app.use('/tasks', tasksRouter);
app.use(express.json());

app.listen(3001, () => { console.log('Server Started') });