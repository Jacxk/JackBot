const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();

module.exports.runWebsite = () => {

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET');

        next();
    });

    app.get("/botstats", (request, response) => {
        response.sendFile(__dirname + '/website/other/botstats.json');
    });

    app.get("/", (request, response) => {
        response.sendFile(__dirname + '/website/index.html');
    });

    app.use((req, res) => {
        res.status(404).sendFile(__dirname + '/website/404.html');
    });

    const listener = app.listen(PORT, () => {
        console.log('Your app is listening on port ' + listener.address().port);
    });

    ping();
};

function ping() {
    const http = require('http');
    setInterval(() => {
        http.get("http://jackbot-djs.herokuapp.com");
    }, 300000);
}