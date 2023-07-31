require('dotenv').config();
const { MongoClient } = require('mongodb');

var db;

module.exports = {
    connect: () => {
        db = new MongoClient(process.env.DB_URL || 'mongodb://0.0.0.0:27017/tasksDB').db();
        console.log('Connected to database: ' + db.databaseName);
    },
    getDB: () => {
        return db;
    }
};