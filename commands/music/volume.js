const music = require("../../utilities/musicUtil.js");

module.exports.run = (message, args) => {
    music.setVolume(message, args)
};

module.exports.command = {
    name: 'volume',
    aliases: ['vol'],
    permission: "none",
    enabled: true
};