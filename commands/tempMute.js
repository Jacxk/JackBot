const muteUtils = require('../utilities/muteUtils.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    message.delete().catch(err => console.log(err));
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return messageUtil.noPermissionMessage(message);
    if (args.length === 1 || args.length === 2 || args.length === 3)
        return messageUtil.wrongUsage(message.channel, 'tempMute [time|s|m|h|d] [@User] [reason]', 'tempMute 1h @By_Jack#0047 Swearing in the chat');

    let memberToMute = message.mentions.members.first();

    if (!memberToMute) return messageUtil.specifyUser(message.channel);
    if (memberToMute === message.member) return messageUtil.noSelfPunishment(message.channel);
    if (memberToMute.highestRole.position >= message.member.highestRole.position) return messageUtil.sameRankOrHigher(message.channel);

    let muteRole = message.member.guild.roles.find("name", "Muted");

    if (!muteUtils.createMutedRole(message.guild, message.channel, muteRole, true)) return;
    muteUtils.tempMute(args, memberToMute, muteRole, message, args);
};

module.exports.command = {
    name: 'tempmute',
    aliases: ['tempm', 'tmute', 'tm']
};