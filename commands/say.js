const Discord = require('discord.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    let channel = message.channel;
    if (channel.type !== "dm" && !message.member.hasPermission("ADMINISTRATOR")) return messageUtil.noPermissionMessage(message);
    if (args.length < 2) return messageUtil.wrongUsage(message.channel, 'say [text]', 'say --title:A_Title A Simple Text --color:red');

    let embed = new Discord.RichEmbed();

    let list = [];
    let title = null;
    let color = null;

    for (let i = 1; i < args.length; i++) {
        if (args[i].includes('--title:')) {
            title = args[i].substring(8).split('_').join(' ');
            list.push(args[i].substring(title.length + 8));
            continue;
        }
        if (args[i].includes('--channel:')) {
            channel = message.member.guild.channels.find("name", args[i].substring(10));
            continue;
        }
        if (args[i].includes('--color:')) {
            color = args[i].substring(8);
            list.push(args[i].substring(color.length + 8));
            continue;
        }
        list.push(args[i]);
    }

    message.delete();
    channel.send(embed.setDescription(list.join(' ').trim().split('--newLine').join('\n')).setTitle((title === null) ? ' ' : title)
        .setColor((color === null) ? 'GRAY' : color.toUpperCase()));
};

module.exports.command = {
    name: 'say',
    aliases: ['broadcast', 'bc']
};