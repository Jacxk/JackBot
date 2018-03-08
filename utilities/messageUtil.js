const Discord = require('discord.js');

module.exports.noPermissionMessage = function (message) {
    let embed = new Discord.RichEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor("RED");
    message.channel.send(embed).then(m => m.delete(1000 * 10));
    message.react('❌').catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
    message.delete(1000 * 10).catch(err => console.log(err));
};