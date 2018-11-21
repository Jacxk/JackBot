const Command = require('../../utilities/classes/Command.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');
const ms = require('ms');

class Ping extends Command {
    constructor() {
        super('ping');
        this.setCategory('misc');
    }

    async execute(message, args, client) {
        let embed = new Discord.RichEmbed().setColor("NAVY");
        const time = Date.now();
        const locale = client.getLocale(message.guild.id);

        embed.setAuthor(`PONG!`, client.user.displayAvatarURL);
        embed.addField(Translation.get('ping', locale), '🔌 ' + Math.round(client.ping) + 'ms', true);

        embed.setTimestamp();

        message.channel.send('PING?!?!').then(msg => {
            embed.addField(Translation.get('response_time', locale), '🔌 ' + Math.round(Date.now() - time) + 'ms', true);
            msg.edit(embed).catch(err => console.log(err))
        });
    }
}

module.exports = Ping;