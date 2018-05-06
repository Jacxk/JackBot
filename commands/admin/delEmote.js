const messageUtil = require('../../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    if (args.length < 2)
        return messageUtil.wrongUsage(message.channel, 'delEmote [name of emote]', 'delEmote KAPPA');

    let emote = message.guild.emojis.find(emoji => emoji.name.toLowerCase() === args.slice(1).join(' ').toLowerCase().trim());
    if (!emote) return messageUtil.sendError(message.channel, 'That emote does not exist in this guild');

    message.guild.deleteEmoji(emote).catch(err => messageUtil.sendError(message.channel, err.toString()));
};

module.exports.command = {
    name: 'delemote',
    permission: "ADMINISTRATOR",
    enabled: false
};