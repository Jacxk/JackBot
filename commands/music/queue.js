const music = require("../../utilities/musicUtil.js");

module.exports.run = (message) => {
    music.getQueue(message)
};

module.exports.command = {
    name: 'queue',
    aliases: ['q'],
    permission: "none",
    enabled: true
};