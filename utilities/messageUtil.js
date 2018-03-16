const Discord = require('discord.js');
const prefixUtil = require('../utilities/prefixUtil.js');

module.exports.noPermissionMessage = (message) => {
    let embed = new Discord.RichEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor("RED");
    message.channel.send(embed).then(m => m.delete(10000));
    message.react('❌').catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
};

module.exports.specifyUser = (channel) => {
    let embed = new Discord.RichEmbed();
    channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('Please specify a @user')).then(m => m.delete(10000));
};

module.exports.noSelfPunishment = (channel) => {
    let embed = new Discord.RichEmbed();
    channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('You can\'t do this to your self...')).then(m => m.delete(10000));
};

module.exports.sameRankOrHigher = (channel) => {
    let embed = new Discord.RichEmbed();
    channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('You can\'t do this to a user with same rank or higher...')).then(m => m.delete(10000));
};

module.exports.wrongUsage = (channel, usage, example) => {
    const prefix = prefixUtil.getPrefix(channel.guild.id);
    let embed = new Discord.RichEmbed();
    channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('Usage: ' + prefix + usage).setFooter(prefix + example)).then(m => m.delete(10000));
};

module.exports.sendError = (channel, error) => {
    let embed = new Discord.RichEmbed();
    channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(error)).then(m => m.delete(10000));
};