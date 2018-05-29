const Discord = require('discord.js');
const messageUtil = require('../../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');

    message.delete();

    if (args.length < 2) return messageUtil.wrongUsage(message.channel, 'clear [@user] [Number]', 'clear 50');

    else clearMessages(message, args);
};

function clearMessages(message, args) {
    let embed = new Discord.RichEmbed();
    let amount = args[args.length - 1];

    if (isNaN(amount)) return messageUtil.sendError(message.channel, 'You need to enter a number.');

    
    message.channel.bulkDelete(parseInt(amount)).then(() =>
        message.channel.send(embed.setTitle('✅ DELETED MESSAGES ✅').setDescription(`You have deleted ${amount} messages.`)
            .setColor("BLUE")).then(sent => sent.delete(1000 * 10))
    ).catch(error => {
        if (error.toString().includes('Unknown Message')) return;
        messageUtil.sendError(message.channel, error.toString())
    });
}

module.exports.command = {
    name: 'clear',
    aliases: ['cc', 'c'],
    permission: "MANAGE_MESSAGES",
    description: "Clear the specified number of messages.",
    enabled: true
};