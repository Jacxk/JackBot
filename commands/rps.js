const Discord = require('discord.js');
const messageUtil = require('../utilities/messageUtil.js');
const rps = ["rock", "paper", "scissors"];

module.exports.run = (message, args, bot) => {

    if (args.length < 2) return messageUtil.wrongUsage(message.channel, 'rps [rock/paper/scissors]', 'rps rock');
    if (!rps.includes(args[1].toLowerCase()))
        return messageUtil.sendError(message.channel, 'You need to use rock, paper, or scissors in order to play');

    const embed = new Discord.RichEmbed();
    const rpsRandom = rps[Math.floor(Math.random() * rps.length)];
    const member = message.member;

    let winner = '';
    switch (rpsRandom) {
        case 'rock':
            switch (args[1].toLowerCase()) {
                case 'rock':
                    winner = 'Tie';
                    embed.setColor('#03A9F4');
                    break;
                case 'paper':
                    winner = member.displayName;
                    embed.setColor('#76FF03');
                    break;
                case 'scissors':
                    winner = bot.user.username;
                    embed.setColor('#dd0400');
                    break;
            }
            break;
        case 'paper':
            switch (args[1].toLowerCase()) {
                case 'rock':
                    winner = bot.user.username;
                    embed.setColor('#DD0400');
                    break;
                case 'paper':
                    winner = 'Tie';
                    embed.setColor('#03A9F4');
                    break;
                case 'scissors':
                    winner = member.displayName;
                    embed.setColor('#76FF03');
                    break;
            }
            break;
        case 'scissors':
            switch (args[1].toLowerCase()) {
                case 'rock':
                    winner = member.displayName;
                    embed.setColor('#76FF03');
                    break;
                case 'paper':
                    winner = bot.user.username;
                    embed.setColor('#DD0400');
                    break;
                case 'scissors':
                    winner = 'Tie';
                    embed.setColor('#03A9F4');
                    break;
            }
            break;
    }

    embed.setAuthor(message.author.username, message.author.avatarURL).addField('You Chose:', args[1], true)
        .addField('I Choose:', rpsRandom, true).addField('Winner:', winner);

    message.channel.send(embed);
};

module.exports.command = {
    name: 'rockpaperscissors',
    aliases: ["rockpaper", "rps", "rockps"],
    permission: "none",
    enabled: true,
    description: 'Rock Paper Scissors... Who would win?'
};