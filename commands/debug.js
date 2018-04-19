const joinLeaveThemes = require("../index.js").joinLeaveThemes;

module.exports.run = (message, args) => {

    if (args.length <= 1) return;
    const member = message.mentions.members.first() || message.member;

    switch (args[1]) {
        case 'join':
            joinLeaveThemes.get(args.length === 4 ? args[3] : 'default').join(member, message.channel);
            break;
        case 'leave':
            joinLeaveThemes.get(args.length === 4 ? args[3] : 'default').leave(member, message.channel);
            break;
    }
};

module.exports.command = {
    name: 'debug',
    aliases: ['dbg', 'dbug'],
    permission: "ADMINISTRATOR",
    enabled: false
};