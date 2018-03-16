const Discord = require('discord.js');
const config = require('../config.json');
const prefix = config.prefix;

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    //if (!message.member.hasPermission("ADMINISTRATOR")) return messageUtil.noPermissionMessage(message);

    let embed = new Discord.RichEmbed();

    if (args.length < 2) {
        embed.setTitle('❌ ERROR ❌').setDescription('**Wrong Usage, you need to specify the name of the emote.**'
            + `\n**Usage: ${prefix}delEmote [name of emote]**`).setColor("RED");
        message.channel.send(embed).then(msg => msg.delete(10 * 1000));
        message.react('❌').catch(err => console.log(err));
        message.delete(1000 * 10);
        return;
    }
    let emote = message.guild.emojis.find(emoji => emoji.name.toLowerCase() === args.slice(1).join(' ').toLowerCase().trim());
    if (!emote) return message.channel.send(embed.setDescription('That emote does not exist in this guild')
        .setTitle('❌ ERROR ❌').setColor('RED'));
    message.guild.deleteEmoji(emote).catch(err => message.channel.send(embed.setTitle('❌ ERROR ❌')
        .setDescription(err).setColor("RED")).then(msg => msg.delete(20 * 1000)));
};

module.exports.command = {
    name: 'delemote'
};