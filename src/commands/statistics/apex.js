const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');

const got = require('got');
const Discord = require('discord.js');

class apex extends Command {
    constructor() {
        super('apex', ["apexlegends", "alegends"]);
        this.setUsage('<user> <platform>');
        this.setCategory('statistics');
    }

    async execute(message, args, client) {
        const channel = message.channel;

        if (args.length < 2) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'apex pc ninja');

        const username = args[1];
        let platform;

        switch (args[0]) {
            case "pc":
                platform = 5;
                break;
            case "xbox":
                platform = 1;
                break;
            case "psn":
                platform = 2;
                break;
        }

        const locale = client.getLocale(message.guild.id);
        if (![1, 2, 5].includes(platform)) return MessageUtil.sendError(Translation.getError('invalid.gamemode.fortnite', locale), channel);

        const {body} = await got(`https://public-api.tracker.gg/apex/v1/standard/profile/${platform}/${username}`, {
            json: true,
            method: 'get',
            headers: {
                'User-Agent': 'nodejs request',
                'TRN-Api-Key': client.config.api.apex
            }
        });

        const data = body.data;
        const stats = data.stats;

        const msg = await channel.send("Retrieving data...");
        await this.getPlayer(msg, data.metadata.platformUserHandle, stats);

        const emojis = ['⬅', '➡'];
        let page = 0;

        await msg.react(emojis[0]);
        await msg.react(emojis[1]);

        const filter = (reaction, user) => reaction.emoji.name === emojis[0] || reaction.emoji.name === emojis[1] && user.id === message.author.id;
        const collector = msg.createReactionCollector(filter, {time: 60 * 1000});

        collector.on('collect', async r => {
            if (r.emoji.name === emojis[0]) {
                if (page > 0) page--;
            } else if (r.emoji.name === emojis[1]) {
                if (page < data.children.length) page++;
            } else return;

            if (page === 0) {
                await this.getPlayer(msg, data.metadata.platformUserHandle, stats)
            } else await this.getStats(data.children, page - 1, msg);
            await r.remove(message.author);
        });
        collector.on('end', () => {
            msg.reactions.forEach(r => r.remove());
        });

    }

    async getStats(data, page, msg) {
        const embed = new Discord.RichEmbed();
        const legend = data[page];
        const name = legend.metadata.legend_name;
        const icon = legend.metadata.icon;

        embed.setThumbnail(icon).setDescription(`Legend Name: **${name}**\n\n` +
            "We can only update the legend currently active on your banner, we can also only get the stats that are available on the banner.\n").setColor('RANDOM');

        const stats = legend.stats;
        for (let j = 0; j < stats.length; j++) {
            const stat_name = stats[j].metadata.name;
            const stat_value = stats[j].displayValue;

            embed.addField(stat_name, stat_value, true);
        }

        embed.setFooter('You have 60 seconds to go through the pages. Sponsored by TrackerNation');
        await msg.edit(embed);
    }

    async getPlayer(msg, uname, stats) {
        const embed = new Discord.RichEmbed();
        embed.setDescription(`Displaying the stats of **\`${uname}\`**`).setColor("GOLD");
        for (let j = 0; j < stats.length; j++) {
            const stat_name = stats[j].metadata.name;
            const stat_value = stats[j].displayValue;

            embed.addField(stat_name, stat_value, true);
        }
        await msg.edit(embed);
    }
}

module.exports = apex;