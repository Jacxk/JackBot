const prefixUtil = require('../utilities/prefixUtil.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    message.delete();
    if (args.length < 2) return messageUtil.wrongUsage(message.channel, 'setPrefix [Text]', 'setPrefix !');
    if (args[1].toLowerCase() === 'get') return message.channel.send(prefixUtil.getPrefix(message.guild.id))
        .then(msg => msg.delete(1000 * 10));
    prefixUtil.connect(message.channel, message.guild, args.slice(1).join(' '));
};

module.exports.command = {
    name: 'setprefix'
};