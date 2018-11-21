const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');
const TicTacToeUtils = require('../../utilities/classes/TicTacToeUtils.js');
const CachedData = require('../../database/CachedData.js');
const TictactoeGame = require('../../database/Database.js').TictactoeGame;

const Discord = require('discord.js');

class TicTacToe extends Command {
    constructor() {
        super('tictactoe', ["ttt", "tictac", "tictoe"]);
        this.setUsage('duel|tutorial <user>');
        this.setCategory('fun');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const challenger = message.member;
        const matches = client.tictactoe.matches;
        const prefix = CachedData.prefixes[message.guild.id] || client.config.default_prefix;

        if (args.length < 1) return MessageUtil.sendWrongUsage(channel, this.getUsage(), 'tictactoe duel @By_Jack#0047');

        switch (args[0].toLowerCase()) {
            case 'duel': {
                const rival = message.mentions.members.first();

                if (!rival) return MessageUtil.sendError('You need to duel someone.', channel);
                if (rival.id === challenger.id) return MessageUtil.sendError('You can\'t duel your self.', channel);
                if (rival.user.bot) return MessageUtil.sendError('You can\'t duel bots.', channel);
                if (matches.get(challenger)) return matches.get(challenger).sendPlayingWith(MessageUtil, channel, challenger);

                const embed = new Discord.RichEmbed().setTitle('TicTacToe Duel').setDescription('Do you accept the challenge???' + rival +
                    '\nReply **YES** to accept, or **NO** to deny.\nYou have 30 seconds!').setColor("LUMINOUS_VIVID_PINK");

                channel.send(embed).then(() => {
                    const yes = m => m.content.toLowerCase() === 'yes' && m.author.id === rival.id;
                    const no = m => m.content.toLowerCase() === 'no' && m.author.id === rival.id;

                    const collectorYes = channel.createMessageCollector(yes, {time: 30000});
                    const collectorNo = channel.createMessageCollector(no, {time: 30000});

                    collectorYes.on('collect', () => {
                        matches.set(challenger, new TicTacToeUtils(challenger, rival, matches));
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
                    `\nE.g. **${prefix}tictactoe duel @someuser#0000**\nThen you have to wait until that person accepts the duel to start playing.\n\n` +
                    '```css\nHow To Play```To make a move you just need to reply with a number from 1-9, only if that place is not taken on the board.');

                channel.send(embed);
                break;
            }
            case "stats": {
                const users = client.users;
                const embed = new Discord.RichEmbed().setColor("GOLD");
                const member = message.mentions.users.first() || users.get(args[1]);

                if (!member) return MessageUtil.sendError(Translation.getError('not_found.user'), channel);
                TictactoeGame.playerData(member.id, function (err, doc) {
                    if (err) return MessageUtil.sendError(err.toString(), channel);
                    if (!doc) return MessageUtil.sendError(Translation.getError('not_found.data'), channel);

                    let last_match = doc.last_matches[doc.last_matches.length - 1];

                    embed.setDescription(
                        `**Wins**: ${doc.wins}\n` +
                        `**Losses**: ${doc.losses}\n` +
                        `**Draws**: ${doc.draws}\n\n` +
                        `**Last Match**:\n` +
                        `**Winner**: ${users.get(last_match.winner).username}\n` +
                        `**Looser**: ${users.get(last_match.looser).username}\n` +
                        last_match.table
                    ).setTitle(member.username + "'s tictactoe data");
                    channel.send(embed);
                });
                break;
            }
            default: {
                MessageUtil.sendWrongUsage(channel, this.getUsage(), 'tictactoe duel @By_Jack#0047');
                break;
            }
        }

    }
}

module.exports = TicTacToe;