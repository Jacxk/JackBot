const fs = require("fs");
const versions = new Map();

module.exports.run = (message, args) => {
    fs.readdir("./changeLog/", (err, files) => {
        if (err) return console.error(err);

        files.forEach(file => {
            versions.set(file.filename, file);
            fs.readFile(`./changelog/${file}`, 'utf8', (err, f) => {
                if (err) return console.error(err);
                versions.set(file, f);
            });
        });

        if (args.length === 1) return message.channel.send(versions.get("v1.0"));

        message.channel.send(versions.get(args[1])).catch(err => console.log(err.stack))
    });
};

module.exports.command = {
    name: "changelog",
    aliases: ["chlog", "clog"]
};
