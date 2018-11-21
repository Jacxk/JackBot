const mongoose = require('mongoose');
const config = require('../../config.js');

const mongodb = config.mongodb;

const connection = mongoose.createConnection(`mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database.users}?retryWrites=true`,
    {useNewUrlParser: true}, function (err) {
        if (err) return console.error(err);
        console.log('Connected to the Users MongoDB')
    });


module.exports = connection;