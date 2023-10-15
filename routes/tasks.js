const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const { ObjectId } = require('mongodb');

const coll = mongo.getDB().collection('tasks');
// coll.insertOne({title:'Complete this project',
//         description:'This is an ESD project which needs to be completed',
//         due:new Date('2023-08-30'),
//         status:"Done"});

// READ
router.get('/', async (req, res) => {
    try {
        const tasks = await coll.find();
        res.json(await tasks.toArray());
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE
router.post('/', async (req, res) => {
    try {
        const task = {
            title: req.body.title,
            description: req.body.description,
            due: new Date(req.body.due),
            status: req.body.status
        };
        await coll.insertOne(task);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const ack = await coll.deleteOne({ _id: new ObjectId(req.params.id) });
        if (ack.deletedCount) res.json({ message: 'Task Deleted' });
        else res.json({ message: 'Cannot find task' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE
router.patch('/:id', async (req, res) => {
    try {
        if (req.body.due) {
            req.body.due = new Date(req.body.due);
        }
        const ack = await coll.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
        if (ack.modifiedCount) res.json({ message: 'Task Updated' });
        else res.json({ message: 'Cannot find task' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// function Task(task) {
//     this.title = task.title;
//     this.description = task.description;
//     this.due = task.due;
// }

// async function getTask(req, res, next) {
//     let task;
//     try {
//         task = await coll.find({ "_id": req.params.id });
//         if (task == null) {
//             return res.status(404).json({ message: 'Cannot find task!' });
//         }
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
//     res.task = task;
//     next();
// }

module.exports = router;