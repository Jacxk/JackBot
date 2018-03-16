const muteUtils = require('../utilities/banUtils.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    message.delete().catch(err => console.log(err));
    if (!message.member.hasPermission("BAN_MEMBERS")) return messageUtil.noPermissionMessage(message);
    if (args.length <= 1) return messageUtil.wrongUsage(message.channel, 'unBan [@User]', 'unBan @By_Jack#0047');

    let memberToBan = args[1];

    if (!memberToBan) return messageUtil.specifyUser(message.channel);
    //if (memberToBan.highestRole.position >= message.member.highestRole.position) return messageUtil.sameRankOrHigher(message.channel);

    muteUtils.unBan(memberToBan, message);
};

module.exports.command = {
    name: 'unban'
};