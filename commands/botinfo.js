const Discord = require('discord.js');

module.exports.run = (message, args, bot) => {
    let embed = new Discord.RichEmbed().setColor("GOLD");

    let seconds = Math.round(bot.uptime / 1000);
    let hours = Math.round(seconds / 3600);
    seconds = Math.round(seconds % 3600);
    let minutes = Math.round(seconds / 60);
    seconds = Math.round(seconds % 60);

    let uptime = ((hours === 0 ? '' : hours + "h ")
        + (minutes === 0 ? '' : minutes + "m ") + seconds + "s");

    embed.setAuthor(`${bot.user.username}'s Information`, bot.user.displayAvatarURL);
    embed.setThumbnail(bot.user.displayAvatarURL);
    embed.addField('My Name', bot.user.username, true);
    embed.addField('Guilds Using Me', bot.guilds.size, true);
    embed.addField('My Ping', Math.round(bot.ping) + 'ms', true);

    embed.addField('My Uptime', uptime, true);
    embed.addField('Members I\'m Watch', bot.users.size, true);

    message.channel.send(embed);
};

module.exports.command = {
    name: 'botinfo'
};