const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = (message) => {
    let embed = new Discord.RichEmbed();
    let member = message.mentions.members.first() || message.member;

    let highRole = member.highestRole;
    let playingStatus = member.presence.game;

    if (member.guild.defaultRole === highRole) highRole.name = 'No Role';

    if (playingStatus) playingStatus = member.presence.game.name;
    else playingStatus = "N/A";

    embed.setThumbnail(member.user.avatarURL).addField('Current Name', member.user.tag, true)
        .addField('Current Level', '0', true)
        .addField('Playing', playingStatus, true).addField('Role', highRole.name, true)
        .addField('Join Date', member.joinedAt.toDateString(), true).setColor(highRole.color);
    message.channel.send(embed);
};

module.exports.command = {
    name: "profile",
    aliases: ['pr', 'prof'],
    permission: "none",
    description: "Check your or someone else's profile.",
    usage: "profile < User >",
    enabled: true
};