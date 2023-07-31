const express = require('express');
const router = express.Router();
const mongo = require('../mongo');

const coll = mongo.getDB().collection('tasks');
// coll.insertOne({title:'Complete this project',
//         description:'This is an ESD project which needs to be completed',
//         due:new Date('2023-08-30')});
router.get('/', (req, res) => {
    res.send('Hello');
});

module.exports = router;