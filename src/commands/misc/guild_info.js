const Command = require('../../utilities/classes/Command.js');
const CachedData = require('../../database/CachedData.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');
const timeAgo = require('node-time-ago');

class GuildInfo extends Command {
    constructor() {
        super('guildinfo', ["guildi", "ginfo", "gi", "serverinfo", "serveri", "sinf", "sinfo"]);
        this.setCategory('misc');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const embed = new Discord.RichEmbed();
        const guild = message.guild;
        const members = guild.members;
        const channels = guild.channels;
        const prefix = CachedData.prefixes[message.guild.id] || client.config.default_prefix;
        const locale = client.getLocale(message.guild.id);

        embed.setThumbnail(guild.iconURL).setColor('ORANGE');
        embed.addField(Translation.get('guild.name', locale), guild.name, true);
        embed.addField(Translation.get('guild.owner', locale), guild.owner.user.tag, true);
        embed.addField(Translation.get('prefix', locale), prefix, true);
        embed.addField(Translation.get('guild.region', locale), guild.region.toUpperCase(), true);
        embed.addField(Translation.get('date.creation', locale), timeAgo(guild.createdAt) + '\n' + guild.createdAt.toDateString(), true);
        embed.addField(Translation.get('members', locale), `${Translation.get('humans', locale)}: ${members.filter(m => !m.user.bot).size}` +
            `\n${Translation.get('bots', locale)}: ${members.filter(m => m.user.bot).size}` +
            `\n${Translation.get('total', locale)}: ${guild.memberCount}`, true);
        embed.addField(Translation.get('channels', locale), `${Translation.get('text', locale)}: ${channels.filter(c => c.type === 'text').size}` +
            `\n${Translation.get('voice', locale)}: ${channels.filter(c => c.type === 'voice').size}` +
            `\n${Translation.get('category', locale)}: ${channels.filter(c => c.type === 'category').size}` +
            `\n${Translation.get('total', locale)}: ${channels.size}`, true);
        channel.send(embed);
    }
}

module.exports = GuildInfo;