const Discord = require('discord.js');
const mysqlUtil = require('../../utilities/mysqlUtil.js');

module.exports.run = (message) => {
    let embed = new Discord.RichEmbed().setColor("GOLD");
    let guild = message.guild;

    embed.setAuthor(`${guild.name}'s Information`, message.author.avatarURL);
    embed.setThumbnail(guild.iconURL);
    embed.addField('Guild Name', guild.name, true);
    embed.addField('Members', guild.memberCount, true);
    embed.addField('Prefix', mysqlUtil.getPrefix(guild.id), true);
    embed.addField('Guild Owner', guild.owner.user.tag, true);
    embed.addField('Guild Region', guild.region, true);
    embed.addField('Creation Date', guild.createdAt.toDateString(), true);

    message.channel.send(embed);
};

module.exports.command = {
    name: 'guildinfo',
    aliases: ['ginfo', 'guildi'],
    permission: "none",
    description: "Get information about the guild.",
    usage: "guildinfo",
    enabled: true
};