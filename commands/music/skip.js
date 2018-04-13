const music = require("../../utilities/musicUtil.js");

module.exports.run = (message) => {
    music.skip(message)
};

module.exports.command = {
    name: 'skip',
    aliases: ['s', 'skp'],
    permission: "none",
    enabled: true
};