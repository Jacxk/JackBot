const music = require("../../utilities/musicUtil.js");

module.exports.run = (message, args) => {
    music.setVolume(message, args)
};

module.exports.command = {
    name: 'volume',
    aliases: ['vol'],
    permission: "none",
    description: "OMG! the music is to loud, TURN IT DOWN!!!",
    usage: "volume [ volume # ]",
    enabled: true
};