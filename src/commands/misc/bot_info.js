const Command = require('../../utilities/classes/Command.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');
const ms = require('ms');

class BotInfo extends Command {
    constructor() {
        super('botinfo', ["botu", "binfo", "bi"]);
        this.setCategory('misc');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const embed = new Discord.RichEmbed();
        const guild = message.guild;
        const locale = client.getLocale(message.guild.id);

        embed.setThumbnail(guild.iconURL).setColor('ORANGE');
        embed.setAuthor(Translation.getCommand('bot_info.embed.title', locale).replaceAll('{0}', client.user.tag), client.user.displayAvatarURL);
        embed.setThumbnail(client.user.displayAvatarURL);
        embed.addField(Translation.get('my_name', locale), '📝 ' + client.user.username, true);
        embed.addField(Translation.get('guilds_using', locale), '🔍 ' + client.guilds.size, true);
        embed.addField(Translation.get('ping', locale), '🔌 ' + Math.round(client.ping) + 'ms', true);

        embed.addField(Translation.get('uptime', locale), '🕙 ' + ms(client.uptime, {long: true}), true);
        embed.addField(Translation.get('watching', locale), '👀 ' + client.users.size + ' members', true);
        embed.setFooter(Translation.getCommand('bot_info.embed.footer', locale).replaceAll('{0}', client.users.get('266315409735548928').tag));

        channel.send(embed);
    }
}

module.exports = BotInfo;