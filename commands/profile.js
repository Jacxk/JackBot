const Discord = require('discord.js');
const fs = require('fs');
let file = fs.readFileSync("./data.json", "utf8");
let user = JSON.parse(file);

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');

    let embed = new Discord.RichEmbed();
    let member = message.mentions.members.first() || message.member;

    let highRole = member.highestRole;
    let playingStatus = member.presence.game;

    if (member.guild.defaultRole === highRole) highRole.name = 'No Role';

    if (playingStatus) playingStatus = member.presence.game.name;
    else playingStatus = "N/A";

    embed.setThumbnail(member.user.avatarURL).addField('Current Name', member.user.tag, true)
        .addField('Current Level', ((user[member.id]) ? user[member.id].level : '0'), true)
        .addField('Playing', playingStatus, true).addField('Role', highRole.name, true)
        .addField('Join Date', member.joinedAt.toDateString(), true).setColor(highRole.color);
    message.channel.send(embed);
};

module.exports.command = {
    name: "profile",
    aliases: ['p', 'prof']
};