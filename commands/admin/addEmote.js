const Discord = require('discord.js');
const messageUtil = require('../../utilities/messageUtil.js');
const validUrl = require('valid-url');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');

    let embed = new Discord.RichEmbed();

    if (args.length < 3) {
        messageUtil.wrongUsage(message.channel, 'addEmote [image url] [name_with_no_space]', 'addEmote https://www.google.com/ wat');
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

module.exports.command = {
    name: 'addemote',
    permission: "ADMINISTRATOR",
    enabled: true
};