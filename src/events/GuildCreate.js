const Discord = require('discord.js');

class Message {
    constructor() {
        this._event = 'guildCreate';
    }

    execute(client, guild) {
        const channel = guild.systemChannel;
        const embed = new Discord.RichEmbed();
        embed.setColor("DARK_VIVID_PINK").setTitle('Hello Humans!');
        embed.setDescription(`Hi, I'm ${client.user.username}.\n\nI'm a bot that can do many many things, such as; ban people, ` +
            "play music, get stats from different games, etc.\n\nMy default prefix is **-** and it can be changed through the website.\n\n" +
            "If you don't remember the prefix you can just mention me and get it or use my mention as prefix.\n\n" +
            "Thanks for inviting me! I hope I can serve your needs!\n\n" +
            "Website: https://jackbot.pw/");
        channel.send(embed);
    }

    getEventName() {
        return this._event;
    }
}

module.exports = Message;