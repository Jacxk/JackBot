const Discord = require('discord.js');
const messageUtil = require('../utilities/messageUtil.js');
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
            'TRN-Api-Key': process.env.fortniteApiKey
        }
    };
    request(options, (err, resp, data) => {
        if (err) return console.log(err);
        if (!data) return messageUtil.sendError(channel, 'Please try again later...');

        let jsonData = JSON.parse(data);

        if (jsonData.error) {
            return messageUtil.sendError(channel, jsonData.error);
        }

        if (jsonData.message) return messageUtil.sendError(channel, jsonData.message);

        //console.log(data);
        let liteTimeEmbed = new Discord.RichEmbed().setColor('GOLD')
            .setFooter('Powered By Fortnite Tracker').setTitle(`${username}'s LifeTime Stats`);

        let timePlayed = jsonData.lifeTimeStats[13];
        let kills = jsonData.lifeTimeStats[10];
        let wins = jsonData.lifeTimeStats[8];
        let matches = jsonData.lifeTimeStats[7];
        let score = jsonData.lifeTimeStats[6];
        let kpg = jsonData.lifeTimeStats[12];
        let kd = jsonData.lifeTimeStats[11];

        liteTimeEmbed.addField(timePlayed.key, timePlayed.value, true);
        liteTimeEmbed.addField(kills.key, kills.value, true);
        liteTimeEmbed.addField(wins.key, wins.value, true);
        liteTimeEmbed.addField(matches.key, matches.value, true);
        liteTimeEmbed.addField(score.key, score.value, true);
        liteTimeEmbed.addField(kpg.key, kpg.value, true);
        liteTimeEmbed.addField(kd.key, kd.value, true);

        if (!mode) return channel.send(liteTimeEmbed);

        switch (mode.toLowerCase()) {
            case "solo":
                let soloEmbed = new Discord.RichEmbed().setColor('BLUE')
                    .setFooter('Powered By Fortnite Tracker').setTitle(`${username}'s Solo Stats`);

                let soloData = jsonData.stats.p2;
                if (!soloData) return messageUtil.sendError(channel, "No data was found...");

                let soloWins = soloData.top1;
                let soloScore = soloData.score;
                let soloKills = soloData.kills;
                let soloTop5 = soloData.top5;
                let soloTop10 = soloData.top10;
                let soloTop25 = soloData.top25;
                let soloKpg = soloData.kpg;

                soloEmbed.addField(soloWins.label, soloWins.displayValue, true);
                soloEmbed.addField(soloScore.label, soloScore.displayValue, true);
                soloEmbed.addField(soloKills.label, soloKills.displayValue, true);
                soloEmbed.addField(soloTop5.label, soloTop5.displayValue, true);
                soloEmbed.addField(soloTop10.label, soloTop10.displayValue, true);
                soloEmbed.addField(soloTop25.label, soloTop25.displayValue, true);
                soloEmbed.addField(soloKpg.label, soloKpg.displayValue, true);

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
                let duoTop5 = duoData.top5;
                let duoTop10 = duoData.top10;
                let duoTop25 = duoData.top25;
                let duoKpg = duoData.kpg;

                duoEmbed.addField(duoWins.label, duoWins.displayValue, true);
                duoEmbed.addField(duoScore.label, duoScore.displayValue, true);
                duoEmbed.addField(duoKills.label, duoKills.displayValue, true);
                duoEmbed.addField(duoTop5.label, duoTop5.displayValue, true);
                duoEmbed.addField(duoTop10.label, duoTop10.displayValue, true);
                duoEmbed.addField(duoTop25.label, duoTop25.displayValue, true);
                duoEmbed.addField(duoKpg.label, duoKpg.displayValue, true);

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
                let squadTop5 = squadData.top5;
                let squadTop10 = squadData.top10;
                let squadTop25 = squadData.top25;
                let squadKpg = squadData.kpg;

                squadEmbed.addField(squadWins.label, squadWins.displayValue, true);
                squadEmbed.addField(squadScore.label, squadScore.displayValue, true);
                squadEmbed.addField(squadKills.label, squadKills.displayValue, true);
                squadEmbed.addField(squadTop5.label, squadTop5.displayValue, true);
                squadEmbed.addField(squadTop10.label, squadTop10.displayValue, true);
                squadEmbed.addField(squadTop25.label, squadTop25.displayValue, true);
                squadEmbed.addField(squadKpg.label, squadKpg.displayValue, true);

                channel.send(squadEmbed);
                break;
            default:
                return messageUtil.sendError(channel, "Valid GameModes are [SOLO, DUO, SQUAD]");
        }
    })
}

module.exports.command = {
    name: 'fortnite',
    aliases: ["fortn", "fnite", "fnt"],
    permission: "none",
    enabled: true
};
