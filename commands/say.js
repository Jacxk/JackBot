const Discord = require('discord.js');

module.exports.run = (message, args) => {
    let channel = message.channel;
    if (channel.type !== "dm" && !message.member.hasPermission("ADMINISTRATOR")) return noPermString(message);
    if (args.length < 2) {
        channel.send('You need to enter a text after that. \nExample: `+say --title:A_Title A Simple Text`');
        return;
    }
    let embed = new Discord.RichEmbed();

    let list = [];
    let title = null;
    let color = null;

    for (let i = 1; i < args.length; i++) {
        if (args[i].includes('--title:')) {
            title = args[i].substring(8).split('_').join(' ');
            list.push(args[i].substring(title.length + 8));
            continue;
        }
        if (args[i].includes('--channel:')) {
            channel = message.member.guild.channels.find("name", args[i].substring(10));
            continue;
        }
        if (args[i].includes('--color:')) {
            color = args[i].substring(8);
            list.push(args[i].substring(color.length + 8));
            continue;
        }
        list.push(args[i]);
    }

    message.delete();
    channel.send(embed.setDescription(list.join(' ').trim().split('--newLine').join('\n')).setTitle((title === null) ? ' ' : title)
        .setColor((color === null) ? 'GRAY' : color.toUpperCase()));
};

function noPermString(message) {
    let embed = new Discord.RichEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor("RED");
    message.channel.send(embed).then(m => m.delete(1000 * 10));
    message.react('❌').catch(err => console.log(err));
    message.delete(1000 * 10);
}

module.exports.command = {
    name: 'say'
};