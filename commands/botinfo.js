const Discord = require('discord.js');

module.exports.run = (message, args, bot) => {
    let embed = new Discord.RichEmbed().setColor("GOLD");

    embed.setAuthor(`${bot.user.username}'s Information`, bot.user.displayAvatarURL);
    embed.setThumbnail(bot.user.displayAvatarURL);
    embed.addField('My Name', '📝 ' + bot.user.username, true);
    embed.addField('Guilds Using Me', '🔍 ' + bot.guilds.size, true);
    embed.addField('My Ping', '🔌 ' + Math.round(bot.ping) + 'ms', true);

    embed.addField('My Uptime', '🕙 ' + millisToTimeString(bot.uptime), true);
    embed.addField('I\'m Watching', '👀 ' + bot.users.size + ' members', true);

    message.channel.send(embed);
};

function millisToTimeString(ms) {
    let days, hours, minutes, seconds;
    seconds = Math.floor(ms / 1000);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    days = Math.floor(hours / 24);
    hours = hours % 24;

    return ((days === 0 ? '' : days + "d ") + (hours === 0 ? '' : hours + "h ")
        + (minutes === 0 ? '' : minutes + "m ") + seconds + "s");
}

module.exports.command = {
    name: 'botinfo',
    aliases: ['binfo', 'boti']
};