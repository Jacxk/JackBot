const Discord = require('discord.js');
const config = require('../config.json');
const validUrl = require('valid-url');
const prefix = config.prefix;

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    if (!message.member.hasPermission("ADMINISTRATOR")) return noPermString(message);

    let embed = new Discord.RichEmbed();

    if (args.length < 3) {
        embed.setTitle('❌ ERROR ❌').setDescription('**Wrong Usage, you need to specify a link of an image and the name of the emote.**'
            + `\n**Usage: ${prefix}addEmote [image url] [name_with_no_space]**`).setColor("RED");
        message.channel.send(embed).then(m => m.delete(1000 * 10));
        message.react('❌').catch(err => console.log(err));
        message.delete(1000 * 10);
        return
    }
    if (!validUrl.isUri(args[1]) && !args[1].endsWith('.jpg') && !args[1].endsWith('.png')) {
        embed.setTitle('❌ ERROR ❌').setDescription("Something went wrong!**" +
        "```You need to enter a valid link, ending in .png or .jpg! Please Try Again...```").setColor("RED");
        message.channel.send(embed).then(m => m.delete(1000 * 10));
        message.react('❌').catch(err => console.log(err));
        message.delete(1000 * 10);
        return;
    }

    embed.setTitle('New Emote...').setDescription(`**Created new emoji with name ${args[2]}!**`).setColor("GOLD");

    message.member.guild.createEmoji(args[1], args[2])
        .catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));

    message.channel.send(embed).then(m => m.delete(1000 * 10));
    message.react("✅").catch(err => console.log(err));
    message.delete(1000 * 10);
};

function noPermString(message) {
    let embed = new Discord.RichEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor("RED");
    message.channel.send(embed).then(m => m.delete(1000 * 10));
    message.react('❌').catch(err => console.log(err));
    message.delete(1000 * 10);
}
module.exports.command = {
    name: 'addemote'
};