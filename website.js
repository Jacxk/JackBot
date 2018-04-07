const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();

module.exports.runWebsite = () => {

    app.use(express.static('/website'));

    app.get("/", (request, response) => {
        response.sendFile(__dirname + '/website/index.html');
    });

    app.get("/home", (request, response) => {
        response.sendFile(__dirname + '/website/index.html');
    });

    app.get("/invite", (request, response) => {
        response.redirect('https://discordapp.com/api/oauth2/authorize?client_id=292180812638715904&permissions=8&scope=bot');
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