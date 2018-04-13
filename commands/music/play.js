const music = require("../../utilities/musicUtil.js");

module.exports.run = (message, args) => {
    music.play(message, args)
};

module.exports.command = {
    name: 'play',
    aliases: ['p', 'pl'],
    permission: "none",
    enabled: true
};