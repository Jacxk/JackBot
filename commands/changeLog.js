const fs = require("fs");
const messageUtil = require('../utilities/messageUtil.js');
const versions = new Map();

module.exports.run = (message, args) => {
    fs.readdir("./changeLog/", (err, files) => {
        if (err) return console.error(err);

        files.forEach(file => {
            versions.set(file.filename, file);
            fs.readFile(`./changeLog/${file}`, 'utf8', (err, f) => {
                if (err) return console.error(err);
                versions.set(file, f);
            });
        });

        if (args.length === 1) return message.channel.send(versions.get("v1.0"));

        const changes = versions.get(args[1]);
        if (!changes) return messageUtil.sendError(message.channel, 'Invalid version string... Try using: ' + versions);

        message.channel.send().catch(err => console.log(err.toString()))
    });
};

module.exports.command = {
    name: "changelog",
    aliases: ["chlog", "clog"]
};
