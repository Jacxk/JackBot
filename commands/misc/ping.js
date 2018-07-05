const Discord = require('discord.js');

module.exports.run = (message, args, a, bot) => {
    let embed = new Discord.RichEmbed().setColor("GOLD");
    const time = Date.now();

    embed.setAuthor(`PONG!`, bot.user.displayAvatarURL);
    embed.addField('My Ping', '🔌 ' + Math.round(bot.ping) + 'ms', true);

    embed.setTimestamp();

    message.channel.send('PING?!?!').then(msg => {
        embed.addField('Response Time', '🔌 ' + Math.round(Date.now() - time) + 'ms', true);
        msg.edit(embed).catch(err => console.log(err))
    });
};

module.exports.command = {
    name: 'ping',
    permission: "none",
    description: "PONG!! Wanna check my ping and response time??",
    usage: "ping",
    enabled: true
};