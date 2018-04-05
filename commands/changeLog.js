const fs = require("fs");
const messageUtil = require('../utilities/messageUtil.js');
const versions = new Map();

fs.readdir("./changeLog/", (err, files) => {
    if (err) return console.error(err);

    files.forEach(file => {
        fs.readFile(`./changeLog/${file}`, 'utf8', (err, f) => {
            if (err) return console.error(err);
            versions.set(file, f);
        });
    });
});

module.exports.run = (message, args) => {
    if (args.length === 1) return message.channel.send(`\`\`\`${versions.get("v1.1")}\`\`\``);

    const changes = versions.get(args[1]);
    if (!changes) {
        const v = [];
        versions.forEach((value, key) => v.push(key));
        return messageUtil.sendError(message.channel, 'Invalid version string... Try using: **' + v.join(", ") + '**');
    }

    message.channel.send(`\`\`\`${changes}\`\`\``).catch(err => console.log(err.toString()))
};

module.exports.command = {
    name: "changelog",
    aliases: ["chlog", "clog"],
    permission: "none",
    enabled: true
};
