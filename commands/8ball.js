const Discord = require('discord.js');
const config = require('../config.json');
const fortune = config.fortune.split(';');
const prefix = config.prefix;

module.exports.run = (message, args) => {
    message.delete().catch(err => console.log(err));
    let embed = new Discord.RichEmbed();

    if (args.length >= 2) {
        embed.setAuthor(message.author.username, message.author.avatarURL);
        embed.addField("Question", message.content.substring(prefix.length + 5));
        embed.addField("Answer",fortune[Math.floor(Math.random() * fortune.length)])
            .setColor("PURPLE");

        message.channel.send(embed);
    }
    else message.channel.send(embed.setTitle('You need to say something after that.\n' +
        'Usage: **+8ball am I gonna be rich?**').setColor("RED"));
};

module.exports.command = {
    name: '8ball'
};