const joinLeave = require("../utilities/joinLeave.js");
const music = require("../utilities/musicUtil.js");

module.exports.run = (message, args) => {

    if (args.length <= 1) return;
    const member = message.mentions.members.first() || message.member;

    switch (args[1]) {
        case 'join':
            joinLeave.imageOnJoin(member, message.channel);
            break;
        case 'leave':
            joinLeave.imageOnLeave(member, message.channel);
            break;
    }
};

module.exports.command = {
    name: 'debug',
    aliases: ['dbg', 'dbug'],
    permission: "ADMINISTRATOR",
    enabled: false
};