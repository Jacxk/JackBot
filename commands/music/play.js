const music = require("../../utilities/musicUtil.js");

module.exports.run = (message, args) => {
    music.play(message, args)
};

module.exports.command = {
    name: 'play',
    aliases: ['p', 'pl'],
    permission: "none",
    description: "Wanna hear some music? Then what are you waiting for.",
    usage: "play [ url/song name ]",
    enabled: true
};