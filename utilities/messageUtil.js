const Discord = require('discord.js');
const config = require('../config.json');

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
    let embed = new Discord.RichEmbed();
    channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('Usage: ' + config.prefix + usage).setFooter(config.prefix + example)).then(m => m.delete(10000));
};