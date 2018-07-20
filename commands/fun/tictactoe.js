const Discord = require('discord.js');
const messageUtil = require('../../utilities/messageUtil.js');
const TicTacToe = require('../../utilities/TicTacToe.js');
const matches = module.exports.matches = new Map();

module.exports.run = (message, args) => {
    const channel = message.channel;
    const challenger = message.member;

    if (args.length < 2) return messageUtil.wrongUsage(channel, 'tictactoe duel/tutorial [ @user ]', 'tictactoe duel @By_Jack#0047');

    switch (args[1].toLowerCase()) {
        case 'duel': {
            const rival = message.mentions.members.first();

            if (!rival) return messageUtil.sendError(channel, 'You need to duel someone.');
            if (rival === challenger) return messageUtil.sendError(channel, 'You can\'t duel your self.');
            if (rival.user.bot) return messageUtil.sendError(channel, 'You can\'t duel bots.');
            if (matches.get(challenger)) return matches.get(challenger).sendPlayingWith(messageUtil, channel, challenger);

            const embed = new Discord.RichEmbed().setTitle('TicTacToe Duel').setDescription('Do you accept the challenge???' + rival +
                '\nReply **YES** to accept, or **NO** to deny.\nYou have 30 seconds!');

            channel.send(embed).then(() => {
                const yes = m => m.content.toLowerCase().includes('yes');
                const no = m => m.content.toLowerCase().includes('no');

                const collectorYes = channel.createMessageCollector(yes, {time: 30000});
                const collectorNo = channel.createMessageCollector(no, {time: 30000});

                collectorYes.on('collect', () => {
                    matches.set(challenger, new TicTacToe.TicTacToe(challenger, rival, matches));
                    matches.set(rival, matches.get(challenger));

                    const match = matches.get(challenger);
                    match.startMatch(channel);
                    collectorYes.stop();
                    collectorNo.stop();
                });

                collectorNo.on('collect', () => {
                    channel.send('The player does not want to play, canceling game!');
                    collectorYes.stop();
                    collectorNo.stop();
                });
            });
            break;
        }
        case 'tutorial': {
            const embed = new Discord.RichEmbed();
            embed.setColor('BLUE').setTitle('TicTacToe Duels Tutorial');
            embed.setDescription('```yaml\nHow To Duel```To play with someone you just need to use the command following by duel and the user.' +
                '\nE.g. **-tictactoe duel @someuser#0000**\nThen you have to wait until that person accepts the duel to start playing.\n\n' +
                '```css\nHow To Play```To make a move you just need to reply with a number from 1-9, only if that place is not taken on the board.');

            channel.send(embed);

            break;
        }
    }
};

module.exports.command = {
    name: 'tictactoe',
    aliases: ["ttt", "tictac", "tictoe"],
    permission: "none",
    description: "X's and O's",
    usage: "tictactoe start [ @user ]",
    enabled: true
};