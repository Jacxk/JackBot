const Discord = require('discord.js');
const request = require('request');
const config = require('../config.json');
const tokenConfig = require('../tokenConfig.json');
const prefix = config.prefix;

module.exports.run = (message, args) => {
    if (args.length < 3) return message.channel.send(new Discord.RichEmbed()
        .setColor('RED').setDescription(`Usage: ${prefix}fortnite [platform] [username] {gamemode}`));
    getFortniteStats(message.channel, args[1], args[2], args[3]);
};

function getFortniteStats(channel, platform, username, mode) {
    let embed = new Discord.RichEmbed().setColor('RED').setTitle('❌ ERROR ❌');
    if (platform.toLowerCase() !== 'psn' && platform.toLowerCase() !== 'pc' && platform.toLowerCase() !== 'xb1') {
        embed.setDescription('Valid platforms are [PSN, PC, XB1]');
        channel.send(embed);
        return;
    }
    let options = {
        method: 'GET',
        url: `https://api.fortnitetracker.com/v1/profile/${platform.toLowerCase()}/${username}`,
        headers: {
            'User-Agent': 'nodejs request',
            'TRN-Api-Key': tokenConfig.fortniteApiKey
        }
    };
    request(options, (error, response, data) => {

        if (!data) {
            embed.setDescription('Please try again later...');
            channel.send(embed);
            return;
        }

        let jsonData = JSON.parse(data);

        if (jsonData.error) {
            embed.setDescription(jsonData.error);
            channel.send(embed);
            return;
        }

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
                if (!soloData) return channel.send(embed.setDescription("No data was found..."));

                let soloWins = soloData.top1;
                let soloScore = soloData.score;
                let soloKills = soloData.kills;
                let soloTop5 = soloData.top5;
                let soloTop10 = soloData.top10;
                let soloTop25 = soloData.top25;
                let soloMinutesPlayed = soloData.minutesPlayed;
                let soloScorePerMin = soloData.scorePerMin;
                let soloKpm = soloData.kpm;
                let soloKpg = soloData.kpg;

                soloEmbed.addField(soloWins.label, soloWins.displayValue, true);
                soloEmbed.addField(soloScore.label, soloScore.displayValue, true);
                soloEmbed.addField(soloKills.label, soloKills.displayValue, true);
                soloEmbed.addField(soloTop5.label, soloTop5.displayValue, true);
                soloEmbed.addField(soloTop10.label, soloTop10.displayValue, true);
                soloEmbed.addField(soloTop25.label, soloTop25.displayValue, true);
                soloEmbed.addField(soloMinutesPlayed.label, soloMinutesPlayed.displayValue, true);
                soloEmbed.addField(soloScorePerMin.label, soloScorePerMin.displayValue, true);
                soloEmbed.addField(soloKpm.label, soloKpm.displayValue, true);
                soloEmbed.addField(soloKpg.label, soloKpg.displayValue, true);

                channel.send(soloEmbed);
                break;
            case "duo":
                let duoEmbed = new Discord.RichEmbed().setColor('GREEN')
                    .setFooter('Powered By Fortnite Tracker').setTitle(`${username}'s Duo Stats`);

                let duoData = jsonData.stats.p10;
                if (!duoData) return channel.send(embed.setDescription("No data was found..."));
                
                let duoWins = duoData.top1;
                let duoScore = duoData.score;
                let duoKills = duoData.kills;
                let duoTop5 = duoData.top5;
                let duoTop10 = duoData.top10;
                let duoTop25 = duoData.top25;
                let duoMinutesPlayed = duoData.minutesPlayed;
                let duoScorePerMin = duoData.scorePerMin;
                let duoKpm = duoData.kpm;
                let duoKpg = duoData.kpg;
                
                duoEmbed.addField(duoWins.label, duoWins.displayValue, true);
                duoEmbed.addField(duoScore.label, duoScore.displayValue, true);
                duoEmbed.addField(duoKills.label, duoKills.displayValue, true);
                duoEmbed.addField(duoTop5.label, duoTop5.displayValue, true);
                duoEmbed.addField(duoTop10.label, duoTop10.displayValue, true);
                duoEmbed.addField(duoTop25.label, duoTop25.displayValue, true);
                duoEmbed.addField(duoMinutesPlayed.label, duoMinutesPlayed.displayValue, true);
                duoEmbed.addField(duoScorePerMin.label, duoScorePerMin.displayValue, true);
                duoEmbed.addField(duoKpm.label, duoKpm.displayValue, true);
                duoEmbed.addField(duoKpg.label, duoKpg.displayValue, true);

                channel.send(duoEmbed);
                break;
            case "squad":
                let squadEmbed = new Discord.RichEmbed().setColor('PURPLE')
                    .setFooter('Powered By Fortnite Tracker').setTitle(`${username}'s Squad Stats`);

                let squadData = jsonData.stats.p9;
                if (!squadData) return channel.send(embed.setDescription("No data was found..."));

                let squadWins = squadData.top1;
                let squadScore = squadData.score;
                let squadKills = squadData.kills;
                let squadTop5 = squadData.top5;
                let squadTop10 = squadData.top10;
                let squadTop25 = squadData.top25;
                let squadMinutesPlayed = squadData.minutesPlayed;
                let squadScorePerMin = squadData.scorePerMin;
                let squadKpm = squadData.kpm;
                let squadKpg = squadData.kpg;

                squadEmbed.addField(squadWins.label, squadWins.displayValue, true);
                squadEmbed.addField(squadScore.label, squadScore.displayValue, true);
                squadEmbed.addField(squadKills.label, squadKills.displayValue, true);
                squadEmbed.addField(squadTop5.label, squadTop5.displayValue, true);
                squadEmbed.addField(squadTop10.label, squadTop10.displayValue, true);
                squadEmbed.addField(squadTop25.label, squadTop25.displayValue, true);
                squadEmbed.addField(squadMinutesPlayed.label, squadMinutesPlayed.displayValue, true);
                squadEmbed.addField(squadScorePerMin.label, squadScorePerMin.displayValue, true);
                squadEmbed.addField(squadKpm.label, squadKpm.displayValue, true);
                squadEmbed.addField(squadKpg.label, squadKpg.displayValue, true);

                channel.send(squadEmbed);
                break;
            default:
                embed.setDescription('An Error has occurred... Valid GameModes are [SOLO, DUO, SQUAD]');
                channel.send(embed);
                break;
        }
    })
}

module.exports.command = {
    name: 'fortnite'
};