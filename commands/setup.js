const mysqlUtil = require('../utilities/mysqlUtil.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    message.delete();

    if (args.length === 1) return messageUtil.wrongUsage(message.channel, 'setup [settings]', 'setup joinleave');

    switch (args[1].toLowerCase()) {
        case "commands":
            commandChannel(message, args);
            break;
        case "incidents":
            incidentsChannel(message, args);
            break;
        case "joinleave":
            joinLeaveChannel(message, args);
            break;
    }
};

function incidentsChannel(message, args) {
    if (args.length < 3) return messageUtil.wrongUsage(message.channel, 'TODO', 'TODO');


}

function joinLeaveChannel(message, args) {
    if (args.length < 3) return messageUtil.wrongUsage(message.channel, 'setup joinleave #channel', 'setup joinleave #welcome');

    if (args[1].toLowerCase() === 'get') return message.channel.send(mysqlUtil.joinLeaveChannels(message.guild.id))
        .then(msg => msg.delete(1000 * 10));

    const channel = message.mentions.channels.first();
    if (!channel) return messageUtil.sendError(message.channel, 'Channel not found!');

    mysqlUtil.setJoinLeaveChannel(message.channel, message.guild, channel.id);
}

function commandChannel(message, args) {
    if (args.length < 3) return messageUtil.wrongUsage(message.channel, 'setup commands #channel', 'setup commands #command-channel');

    if (args[1].toLowerCase() === 'get') return message.channel.send(mysqlUtil.getCommandChannel(message.guild.id))
        .then(msg => msg.delete(1000 * 10));
    if (args[1].toLowerCase() === 'all') return mysqlUtil.changeCommandChannel(message.channel, message.guild, 'ALL');

    const channel = message.mentions.channels.first();
    if (!channel) return messageUtil.sendError(message.channel, 'Channel not found!');

    mysqlUtil.changeCommandChannel(message.channel, message.guild, channel);
}

module.exports.command = {
    name: 'setup',
    aliases: ['settings', 'stp', 'stt'],
    permission: "ADMINISTRATOR",
    enabled: true
};