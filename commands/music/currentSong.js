const music = require("../../utilities/musicUtil.js");

module.exports.run = (message) => {
    music.currentSong(message)
};

module.exports.command = {
    name: 'currentsong',
    aliases: ['csong', 'playing', 'current'],
    permission: "none",
    enabled: true
};