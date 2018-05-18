const Discord = require('discord.js');
const index = require("../index.js");

module.exports.run = (message) => {
    message.delete().catch(err => console.log(err));
    let embed = new Discord.RichEmbed();

    embed.setColor('AQUA');
    embed.setTimestamp();
    embed.setDescription('**All commands reloaded!**');

    message.channel.send(embed);

    index.loadCommands();

};

module.exports.command = {
    name: 'reload',
    aliases: ['rl'],
    permission: "ADMINISTRATOR",
    enabled: false
};