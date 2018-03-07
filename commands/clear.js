const Discord = require('discord.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');

    let embed = new Discord.RichEmbed();

    if (args.length < 2) {
        embed.setTitle('❌ ERROR ❌')
            .setDescription("**Wrong Usage, you need to specify a number of messages to be deleted.**")
            .setColor("RED");
        message.channel.send(embed).then(sent => {
            message.react('❌').catch(err => console.log(err));
            sent.delete(1000 * 10);
            message.delete(1000 * 10);
        });
    }
    else clearMessages(message, args).catch(err => console.log(err));
};

async function clearMessages(message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return noPermString(message);
    message.delete();
    let embed = new Discord.RichEmbed();

    if (isNaN(args[1])) {
        embed.setTitle('❌ ERROR ❌').setDescription("**You need to enter a number.**").setColor("RED");
        message.channel.send(embed).then(sent => sent.delete(1000 * 5));
        message.react('❌').catch(err => console.log(err));
        message.delete(1000 * 5);
        return;
    }

    let messages = await message.channel.fetchMessages({limit: args[1]});

    message.channel.bulkDelete(messages).catch(error => message.channel.send(`Error: ${error}`));

    message.channel.send(embed.setTitle('✅ DELETED MESSAGES ✅').setDescription(`**You have deleted ${args[1]} messages**`)
        .setColor("BLUE")).then(sent => {
        sent.delete(1000 * 10);
    });
}

function noPermString(message) {
    let embed = new Discord.RichEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor("RED");
    message.channel.send(embed).then(m => m.delete(1000 * 10));
    message.react('❌').catch(err => console.log(err));
    message.delete(1000 * 10).catch(err => console.log(err));
}

module.exports.command = {
    name: 'clear'
};