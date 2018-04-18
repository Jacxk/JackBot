const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();

module.exports.runWebsite = () => {

    app.use((req, res, next) => {
        express.static('/website');

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Methods', 'GET');

        next();
    });

    app.get("/botstats,json", (request, response) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.setHeader('Access-Control-Allow-Methods', 'GET');

        response.sendFile(__dirname + '/website/other/botstats.json');
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