const Discord = require('discord.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');

    message.delete();

    if (args.length < 2) return messageUtil.wrongUsage(message.channel, 'clear <@user> [Number]', 'clear 50');

    else clearMessages(message, args).catch(err => console.log(err));
};

async function clearMessages(message, args) {
    let embed = new Discord.RichEmbed();
    let amount = args[args.length - 1];

    if (isNaN(amount)) return messageUtil.sendError(message.channel, 'You need to enter a number.');

    let messages = await message.channel.fetchMessages({limit: parseInt(amount) + 1});

    message.channel.bulkDelete(messages).catch(error => messageUtil.sendError(message.channel, error.toString()));

    message.channel.send(embed.setTitle('✅ DELETED MESSAGES ✅').setDescription(`You have deleted ${amount} messages.`)
        .setColor("BLUE")).then(sent => sent.delete(1000 * 10));
}

module.exports.command = {
    name: 'clear',
    aliases: ['cc', 'c'],
    permission: "MANAGE_MESSAGES",
    enabled: true
};