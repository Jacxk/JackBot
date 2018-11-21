const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');

const got = require('got');
const Discord = require('discord.js');

class Fortnite extends Command {
    constructor() {
        super('fortnite', ["fnbr", "fort", "fnt"]);
        this.setUsage('<user> <platform> [gamemode]');
        this.setCategory('statistics');
    }

    async execute(message, args, client) {
        const channel = message.channel;

        if (args.length < 2) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'fortnite pc exranger [solo, duo or squad]');

        const username = args[0];
        const platform = args[1];
        const mode = args[2];

        if (platform.toLowerCase() !== 'psn' && platform.toLowerCase() !== 'pc' && platform.toLowerCase() !== 'xb1')
            return MessageUtil.sendError(Translation.getError('invalid.gamemode.fortnite', locale)
                .replaceAll('{gamemode}', mode), channel);

        try {
            const {body} = await got(`https://api.fortnitetracker.com/v1/profile/${platform.toLowerCase()}/${username}`, {
                json: true,
                headers: {
                    'User-Agent': 'nodejs request',
                    'TRN-Api-Key': client.config.api.fortnite
                }
            });

            const locale = client.getLocale(message.guild.id);

            if (!mode) {
                let lifeTimeEmbed = new Discord.RichEmbed().setColor('GOLD')
                    .setFooter(Translation.getCommand('fortnite.embed.footer', locale))
                    .setTitle(Translation.getCommand('fortnite.embed.title', locale)
                        .replaceAll('{0}', username)
                        .replaceAll('{1}', 'Lifetime'));

                let kills = body.lifeTimeStats[10];
                let wins = body.lifeTimeStats[8];
                let matches = body.lifeTimeStats[7];
                let top5 = body.lifeTimeStats[1];
                let top25 = body.lifeTimeStats[5];
                let score = body.lifeTimeStats[6];
                let kd = body.lifeTimeStats[11];
                let deaths = Math.floor(parseInt(kills.value) / parseFloat(kd.value)).toString();

                lifeTimeEmbed.addField(wins.key, wins.value, true);
                lifeTimeEmbed.addField(kills.key, kills.value, true);
                lifeTimeEmbed.addField('Deaths', deaths, true);
                lifeTimeEmbed.addField(matches.key, matches.value, true);
                lifeTimeEmbed.addField(top5.key, top5.value, true);
                lifeTimeEmbed.addField(top25.key, top25.value, true);
                lifeTimeEmbed.addField(kd.key, kd.value, true);
                lifeTimeEmbed.addField(score.key, score.value, true);
                lifeTimeEmbed.addBlankField(true);

                return channel.send(lifeTimeEmbed);
            }

            switch (mode.toLowerCase()) {
                case "solo":
                    let soloEmbed = new Discord.RichEmbed().setColor('BLUE')
                        .setFooter(Translation.getCommand('fortnite.embed.footer', locale))
                        .setTitle(Translation.getCommand('fortnite.embed.title', locale)
                            .replaceAll('{0}', username)
                            .replaceAll('{1}', 'Solo'));

                    let soloData = body.stats.p2;
                    if (!soloData) return MessageUtil.sendError(Translation.getError('not_found.data', locale), channel);

                    let soloWins = soloData.top1;
                    let soloScore = soloData.score;
                    let soloKills = soloData.kills;
                    let soloKd = soloData.kd;
                    let soloDeaths = Math.floor(parseInt(soloKills.displayValue) / parseFloat(soloKd.displayValue)).toString();
                    let soloTop5 = soloData.top5;
                    let soloTop10 = soloData.top10;
                    let soloTop25 = soloData.top25;
                    let soloKpg = soloData.kpg;

                    soloEmbed.addField(soloWins.label, soloWins.displayValue, true);
                    soloEmbed.addField(soloScore.label, soloScore.displayValue, true);
                    soloEmbed.addField(soloKills.label, soloKills.displayValue, true);
                    soloEmbed.addField('Deaths', soloDeaths, true);
                    soloEmbed.addField(soloTop5.label, soloTop5.displayValue, true);
                    soloEmbed.addField(soloTop10.label, soloTop10.displayValue, true);
                    soloEmbed.addField(soloTop25.label, soloTop25.displayValue, true);
                    soloEmbed.addField(soloKpg.label, soloKpg.displayValue, true);
                    soloEmbed.addField(soloKd.label, soloKd.displayValue, true);

                    channel.send(soloEmbed);
                    break;
                case "duo":
                    let duoEmbed = new Discord.RichEmbed().setColor('GREEN')
                        .setFooter(Translation.getCommand('fortnite.embed.footer', locale))
                        .setTitle(Translation.getCommand('fortnite.embed.title', locale)
                            .replaceAll('{0}', username)
                            .replaceAll('{1}', 'Duo'));

                    let duoData = body.stats.p10;
                    if (!duoData) return MessageUtil.sendError(Translation.getError('not_found.data', locale), channel);

                    let duoWins = duoData.top1;
                    let duoScore = duoData.score;
                    let duoKills = duoData.kills;
                    let duoKd = duoData.kd;
                    let duoDeaths = Math.floor(parseInt(duoKills.displayValue) / parseFloat(duoKd.displayValue)).toString();
                    let duoTop5 = duoData.top5;
                    let duoTop10 = duoData.top10;
                    let duoTop25 = duoData.top25;
                    let duoKpg = duoData.kpg;

                    duoEmbed.addField(duoWins.label, duoWins.displayValue, true);
                    duoEmbed.addField(duoScore.label, duoScore.displayValue, true);
                    duoEmbed.addField(duoKills.label, duoKills.displayValue, true);
                    duoEmbed.addField('Deaths', duoDeaths, true);
                    duoEmbed.addField(duoTop5.label, duoTop5.displayValue, true);
                    duoEmbed.addField(duoTop10.label, duoTop10.displayValue, true);
                    duoEmbed.addField(duoTop25.label, duoTop25.displayValue, true);
                    duoEmbed.addField(duoKpg.label, duoKpg.displayValue, true);
                    duoEmbed.addField(duoKd.label, duoKd.displayValue, true);

                    channel.send(duoEmbed);
                    break;
                case "squad":
                    let squadEmbed = new Discord.RichEmbed().setColor('PURPLE')
                        .setFooter(Translation.getCommand('fortnite.embed.footer', locale))
                        .setTitle(Translation.getCommand('fortnite.embed.title', locale)
                            .replaceAll('{0}', username)
                            .replaceAll('{1}', 'Squad'));

                    let squadData = body.stats.p9;
                    if (!squadData) return MessageUtil.sendError(Translation.getError('not_found.data', locale), channel);

                    let squadWins = squadData.top1;
                    let squadScore = squadData.score;
                    let squadKills = squadData.kills;
                    let squadKd = squadData.kd;
                    let squadDeaths = Math.floor(parseInt(squadKills.displayValue) / parseFloat(squadKd.displayValue)).toString();
                    let squadTop5 = squadData.top5;
                    let squadTop10 = squadData.top10;
                    let squadTop25 = squadData.top25;
                    let squadKpg = squadData.kpg;

                    squadEmbed.addField(squadWins.label, squadWins.displayValue, true);
                    squadEmbed.addField(squadScore.label, squadScore.displayValue, true);
                    squadEmbed.addField(squadKills.label, squadKills.displayValue, true);
                    squadEmbed.addField('Deaths', squadDeaths, true);
                    squadEmbed.addField(squadTop5.label, squadTop5.displayValue, true);
                    squadEmbed.addField(squadTop10.label, squadTop10.displayValue, true);
                    squadEmbed.addField(squadTop25.label, squadTop25.displayValue, true);
                    squadEmbed.addField(squadKpg.label, squadKpg.displayValue, true);
                    squadEmbed.addField(squadKd.label, squadKd.displayValue, true);

                    channel.send(squadEmbed);
                    break;
                default:
                    MessageUtil.sendError(Translation.getError('invalid.gamemode.fortnite', locale)
                        .replaceAll('{gamemode}', mode), channel);
                    break;
            }

        } catch (e) {
            MessageUtil.sendError(e.toString(), channel);
        }
    }
}

module.exports = Fortnite;