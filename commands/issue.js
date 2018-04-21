const Discord = require('discord.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args, nothing, bot) => {
    if (args.length < 2)
        return messageUtil.wrongUsage(message.channel, 'issue [message]', 'issue The guildInfo command is not working');

    const issue = args.slice(1).join(' ');
    const embed = new Discord.RichEmbed();

    embed.setTitle('New Issue').setColor('GREEN').setDescription(issue).addField('Guild Name', message.guild.name)
        .addField('User', message.member.displayName).addField('Date', message.createdAt.toDateString());
    message.channel.createInvite().then(invite => embed.setURL(invite.url)).catch(err => console.error(err.toString()));

    const channel = bot.channels.get('434434213148884992');

    channel.send(embed);
};

module.exports.command = {
    name: 'issue',
    aliases: [],
    permission: "Administrator",
    enabled: true
};