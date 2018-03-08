const messageUtil = require('../utilities/messageUtil.js');
const muteUtils = require('../utilities/muteUtils.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    message.delete().catch(err => console.log(err));
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return messageUtil.noPermissionMessage(message);

    let memberToMute = message.mentions.members.first();

    if (memberToMute === message.member) return messageUtil.noSelfPunishment(message.channel);
    if (!memberToMute) return messageUtil.specifyUser(message.channel);

    let muteRole = message.member.guild.roles.find("name", "Muted");

    if (!muteUtils.createMutedRole(message.guild, message.channel, muteRole, true)) return;
    muteUtils.unMute(memberToMute, muteRole, message);
};

module.exports.command = {
    name: 'unmute'
};