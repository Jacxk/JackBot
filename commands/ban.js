const muteUtils = require('../utilities/banUtils.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    message.delete().catch(err => console.log(err));
    //if (!message.member.hasPermission("BAN_MEMBERS")) return messageUtil.noPermissionMessage(message);
    if (args.length === 1 || args.length === 2)
        return messageUtil.wrongUsage(message.channel, 'ban [@User] [reason]', 'ban @By_Jack#0047 He wanted to get banned!');

    let memberToBan = message.mentions.members.first() || args[1];

    if (!memberToBan) return messageUtil.specifyUser(message.channel);
    if (memberToBan === message.member) return messageUtil.noSelfPunishment(message.channel);
    if (memberToBan.highestRole.position >= message.member.highestRole.position) return messageUtil.sameRankOrHigher(message.channel);

    muteUtils.ban(memberToBan, message, args, false, 'Permanent');
};

module.exports.command = {
    name: 'ban'
};