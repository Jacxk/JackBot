const Discord = require('discord.js');
const config = require('../config.json');
const prefix = config.prefix;

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    if (!message.member.hasPermission("ADMINISTRATOR")) return noPermString(message);

    let embed = new Discord.RichEmbed();

    if (args.length < 2) {
        embed.setTitle('❌ ERROR ❌').setDescription('**Wrong Usage, you need to specify the name of the emote.**'
            + `\n**Usage: ${prefix}delEmote [name of emote]**`).setColor("RED");
        message.channel.send(embed);
        message.react('❌').catch(err => console.log(err));
        message.delete(1000 * 10);
        return;
    }

    message.guild.deleteEmoji(args[1]).catch(err => message.channel.send(embed.setTitle('❌ ERROR ❌')
        .setDescription(err).setColor("RED")));
};

function noPermString(message) {
    let embed = new Discord.RichEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor("RED");
    message.channel.send(embed).then(m => m.delete(1000 * 10));
    message.react('❌').catch(err => console.log(err));
    message.delete(1000 * 10);
}

module.exports.command = {
    name: 'delemote'
};