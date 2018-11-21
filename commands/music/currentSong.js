const music = require("../../utilities/musicUtil.js");

module.exports.run = (message) => {
    music.currentSong(message)
};

module.exports.command = {
    name: 'currentsong',
    aliases: ['csong', 'playing_next', 'current'],
    permission: "none",
    description: "Displays the current song playing_next",
    usage: "currentsong",
    enabled: true
};