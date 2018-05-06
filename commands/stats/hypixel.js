const Discord = require('discord.js');
const request = require('request');
const mysqlUtil = require('../../utilities/mysqlUtil.js');

module.exports.run = (message, args) => {
    getHypixelData(args, message.channel, mysqlUtil.getPrefix(message.guild.id));
};

function getHypixelData(args, channel, prefix) {
    let playerName = args[1];
    request.get("https://api.hypixel.net/player?key=" + process.env.hypixelToken + "&name=" + playerName, function (err, res, data) {
        if (err) return console.log(err);
        let embed = new Discord.RichEmbed();
        if (args.length !== 3 || args.length === 2 && args[1].toLowerCase() === "help") {
            embed.setDescription("These are all the available gamemodes and its description:\n" +
                    "```Yaml\nSkywars: Shows statistics about wins, losses, kills and deaths.\n" +
                    "Bedwars: Shows statistics about wins, losses, kills, deaths and beds broken.\n" +
                    "Arcade: Shows statistics about wins, coins and more.\n" +
                    "General: Shows the player's statistics such as level, language, etc```")
                .setFooter(`Correct usage: ${prefix}hypixel [playerName] [gameMode]`)
                .setColor("AQUA");
            channel.send(embed);
            return;
        }

        let gameMode = args[2];
        let dataConverted = JSON.parse(data);
        let numberFormat = new Intl.NumberFormat("en-US");

        if (!dataConverted.player) return channel.send("**Player could not be found in the Mojang data base!**");

        switch (gameMode.toLowerCase()) {
            case "skywars":
                let skyStats = dataConverted.player.stats["SkyWars"];
                if (!skyStats) return channel.send("**That player has never played in Skywars!**");

                embed.setColor("DARK_RED")
                    .setThumbnail("https://minotar.net/avatar/" + playerName)
                    .setDescription(playerName + "'s Skywars Statistics")
                    .addField("Total Wins", numberFormat.format(skyStats.wins), true)
                    .addField("Total Losses", numberFormat.format(skyStats.losses), true)
                    .addField("Total Kills", numberFormat.format(skyStats.kills), true)
                    .addField("Total Deaths", numberFormat.format(skyStats.deaths), true)
                    .addField("Kills Solo", numberFormat.format(skyStats.kills_solo), true)
                    .addField("Deaths Solo", numberFormat.format(skyStats.deaths_solo), true)
                    .addField("Kills Team", numberFormat.format(skyStats.kills_team), true)
                    .addField("Deaths Team", numberFormat.format(skyStats.deaths_team), true)
                    .addField("Coins", numberFormat.format(skyStats.coins), true)
                    .addField("Souls", numberFormat.format(skyStats.souls), true)
                    .addField("Games", numberFormat.format(skyStats.games), true)
                    .addField("Last Game Played", skyStats.lastMode, true)
                    .setFooter("These are stats from the Hypixel Network");

                channel.send(embed);
                break;
            case "bedwars":
                let bedStats = dataConverted.player.stats["Bedwars"];
                if (!bedStats) return channel.send("**That player has never played in Bedwars!**");

                embed.setColor("AQUA")
                    .setThumbnail("https://minotar.net/avatar/" + playerName)
                    .setDescription(playerName + "'s Bedwars Statistics")
                    .addField("Total Wins", numberFormat.format(bedStats.wins_bedwars), true)
                    .addField("Total Losses", numberFormat.format(bedStats.losses_bedwars), true)
                    .addField("Beds Broken", numberFormat.format(bedStats.beds_broken_bedwars), true)
                    .addField("Beds Broken", numberFormat.format(bedStats.beds_broken_bedwars), true)
                    .addField("Kills", numberFormat.format(bedStats.kills_bedwars), true)
                    .addField("Deaths", numberFormat.format(bedStats.deaths_bedwars), true)
                    .addField("Coins", numberFormat.format(bedStats.coins), true)
                    .addField("Games Played", numberFormat.format(bedStats.games_played_bedwars), true)
                    .setFooter("These are stats from the Hypixel Network");

                channel.send(embed);
                break;
            case "arcade":
                let arcadeStats = dataConverted.player.stats["Arcade"];
                if (!arcadeStats) return channel.send("**That player have never played in Hypixel!**");

                embed.setColor("RANDOM")
                    .setThumbnail("https://minotar.net/avatar/" + playerName)
                    .setDescription(playerName + "'s Arcade Statistics")
                    .addField("Hypixel says Wins", numberFormat.format(arcadeStats.wins_simon_says), true)
                    .addField("Grinch Sim. Wins", numberFormat.format(arcadeStats.wins_grinch), true)
                    .addField("Mini Walls Wins", numberFormat.format(arcadeStats.wins_mini_walls), true)
                    .addField("Soccer Wins", numberFormat.format(arcadeStats.wins_soccer), true)
                    .addField("Party Wins", numberFormat.format(arcadeStats.wins_party_3), true)
                    .addField("DragonsWars Wins", numberFormat.format(arcadeStats.wins_dragonwars2), true)
                    .addField("Coins", numberFormat.format(arcadeStats.coins), true)
                    .setFooter("These are stats from the Hypixel Network");

                channel.send(embed);
                break;
            default:
                channel.send("Coming Soon");
                break;
        }
    });
}

module.exports.command = {
    name: 'hypixel',
    aliases: ['hyp', 'hpxl'],
    permission: "none",
    enabled: true
};