const mysqlUtil = require('../utilities/mysqlUtil.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    message.delete();
    if (!message.member.hasPermission("ADMINISTRATOR")) return messageUtil.noPermissionMessage(message);

    if (args.length < 2) return messageUtil.wrongUsage(message.channel, 'setPrefix [Text]', 'setPrefix !');
    if (args[1].toLowerCase() === 'get') return message.channel.send(mysqlUtil.getPrefix(message.guild.id))
        .then(msg => msg.delete(1000 * 10));
    mysqlUtil.changePrefix(message.channel, message.guild, args.slice(1).join(' '));
};

module.exports.command = {
    name: 'setprefix',
    aliases: ['sprefix', 'setp']
};