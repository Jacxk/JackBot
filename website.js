const config = require(__dirname + '/config.json');
const PORT = config.website.port;
const express = require('express');
const index = require('./index.js');
const app = express();

module.exports.runWebsite = () => {

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET');

        next();
    });

    app.get("/botstats", (request, response) => {
        response.sendFile(__dirname + '/botstats.json');
    });

    app.get('/refresh', (request, response) => {
        const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        if (ip == '94.16.116.240') {
            index.loadGuildInfo();
            response.send('ok');
        }
        else response.send('Forbidden');
    });

    const listener = app.listen(PORT, () => {
        console.log('Your app is listening on port ' + listener.address().port);
    });

};
