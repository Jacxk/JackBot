const music = require("../../utilities/musicUtil.js");

module.exports.run = (message) => {
    music.skip(message)
};

module.exports.command = {
    name: 'skip',
    aliases: ['s', 'skp'],
    permission: "none",
    description: "You don't like the song? Skip it then",
    usage: "skip",
    enabled: true
};