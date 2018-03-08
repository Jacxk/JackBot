const Discord = require('discord.js');

module.exports.noPermissionMessage = function (message) {
    let embed = new Discord.RichEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor("RED");
    message.channel.send(embed).then(m => m.delete(1000 * 10));
    message.react('❌').catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
};

module.exports.specifyUser = function (channel) {
    let embed = new Discord.RichEmbed();
    channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('Please specify a @user')).then(m => m.delete(5000));
};

module.exports.noSelfPunishment = function (channel) {
    let embed = new Discord.RichEmbed();
    channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('You can\'t don this to your self...')).then(m => m.delete(5000));
};