const Discord = require('discord.js');
const config = require('../config.json');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    message.delete().catch(err => console.log(err));
    let embed = new Discord.RichEmbed();

    if (args.length >= 2) {
        const fortune = config.fortune;
        embed.setAuthor(message.author.username, message.author.avatarURL);
        embed.addField("Question", message.content.substring(args[0]));
        embed.addField("Answer",fortune[Math.floor(Math.random() * fortune.length)]).setColor("PURPLE");

        message.channel.send(embed);
    } else messageUtil.wrongUsage(message.channel, '8ball [Question]', '8ball am I gonna be rich?');
};

module.exports.command = {
    name: '8ball',
    aliases: ['fortune'],
    permission: "none",
    enabled: true
};