const Discord = require('discord.js');
const config = require('../../config.json');
const messageUtil = require('../../utilities/messageUtil.js');
const request = require('request');

module.exports.run = (message, args) => {
    if (args.length < 3) return messageUtil.wrongUsage(message.channel, 'fortnite [platform] [username] <<gamemode>>',
        'fortnite pc exranger [solo, duo, squad]');
    getFortniteStats(message.channel, args[1], args[2], args[3]);
};

function getFortniteStats(channel, platform, username, mode) {
    if (platform.toLowerCase() !== 'psn' && platform.toLowerCase() !== 'pc' && platform.toLowerCase() !== 'xb1')
        return messageUtil.sendError(channel, 'Valid platforms are [PSN, PC, XB1]');

    let options = {
        method: 'GET',
        url: `https://api.fortnitetracker.com/v1/profile/${platform.toLowerCase()}/${username}`,
        headers: {
            'User-Agent': 'nodejs request',
            'TRN-Api-Key': config.apiTokens.fortnite
        }
    };
    request(options, (err, resp, data) => {

        if (err) return console.log(err);
        if (!data) return messageUtil.sendError(channel, 'Please try again later...');
        if (!data.startsWith('<')) return messageUtil.sendError(channel, 'Please try again later...');

        try {
            let jsonData = JSON.parse(data);

            if (jsonData.error) {
                return messageUtil.sendError(channel, jsonData.error);
            }

            if (jsonData.message) return messageUtil.sendError(channel, jsonData.message);

            if (!mode) {
                let lifeTimeEmbed = new Discord.RichEmbed().setColor('GOLD')
                    .setFooter('Powered By Fortnite Tracker').setTitle(`${username}'s LifeTime Stats`);

                let kills = jsonData.lifeTimeStats[10];
                let wins = jsonData.lifeTimeStats[8];
                let matches = jsonData.lifeTimeStats[7];
                let top5 = jsonData.lifeTimeStats[1];
                let top25 = jsonData.lifeTimeStats[5];
                let score = jsonData.lifeTimeStats[6];
                let kd = jsonData.lifeTimeStats[11];
                let deaths = Math.floor(parseInt(kills.value) / parseFloat(kd.value)).toString();

                lifeTimeEmbed.addField(wins.key, wins.value, true);
                lifeTimeEmbed.addField(kills.key, kills.value, true);
                lifeTimeEmbed.addField('Deaths', deaths, true);
                lifeTimeEmbed.addField(matches.key, matches.value, true);
                lifeTimeEmbed.addField(top5.key, top5.value, true);
                lifeTimeEmbed.addField(top25.key, top25.value, true);
                lifeTimeEmbed.addField(kd.key, kd.value, true);
                lifeTimeEmbed.addField(score.key, score.value, true);

                return channel.send(lifeTimeEmbed);
            }

            switch (mode.toLowerCase()) {
                case "solo":
                    let soloEmbed = new Discord.RichEmbed().setColor('BLUE')
                        .setFooter('Powered By Fortnite Tracker').setTitle(`${username}'s Solo Stats`);

                    let soloData = jsonData.stats.p2;
                    if (!soloData) return messageUtil.sendError(channel, "No data was found...");

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
                        .setFooter('Powered By Fortnite Tracker').setTitle(`${username}'s Duo Stats`);

                    let duoData = jsonData.stats.p10;
                    if (!duoData) return messageUtil.sendError(channel, "No data was found...");

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
                        .setFooter('Powered By Fortnite Tracker').setTitle(`${username}'s Squad Stats`);

                    let squadData = jsonData.stats.p9;
                    if (!squadData) return messageUtil.sendError(channel, "No data was found...");

                    let squadWins = squadData.top1;
                    let squadScore = squadData.score;
                    let squadKills = squadData.kills;
                    let squadKd = squadKd.kd;
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
                    messageUtil.sendError(channel, "Valid GameModes are [SOLO, DUO, SQUAD]");
                    break;
            }
        } catch (e) {
            messageUtil.sendError(channel, "There was an unexpected error, Please try again!");
        }
    })
}

module.exports.command = {
    name: 'fortnite',
    aliases: ["fortn", "fnite", "fnt"],
    permission: "none",
    description: "Check your stats from Fortnite's database",
    enabled: true
};
