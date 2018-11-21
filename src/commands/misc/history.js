const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');
const Punish = require('../../database/Database.js').Punish;

const ms = require('ms');
const Discord = require('discord.js');

class History extends Command {
    constructor() {
        super('history', ["his", "punishments"]);
        this.setUsage('<@user | id> [amount] [type]');
        this.setCategory('misc');
    }

    async execute(message, args, client) {
        if (args.length < 1) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'history @By_Jack#0047');
        const channel = message.channel;
        const embed = new Discord.RichEmbed();

        const user = message.mentions.members.first() || message.guild.member(args[0]);
        const amount = parseInt(args[1]) || 1;
        const type = (args[2] || 'any').toLowerCase();
        const locale = client.getLocale(message.guild.id);

        if (!user) return MessageUtil.sendError(Translation.getError('not_found.user', locale), channel);
        if (isNaN(amount)) return MessageUtil.sendError(Translation.getError('invalid.number', locale), channel);

        Punish.getPunishment(user, amount, type === 'any' ? null : type, async function (err, docs) {
            if (err) return MessageUtil.sendError(err.toString(), channel);
            embed.setColor('AQUA').setTitle(Translation.getCommand('history.embed.title', locale));
            embed.setFooter(Translation.getCommand('history.embed.footer', locale)
                .replaceAll('{0}', await Punish.getPunishmentCount(user, type === 'any' ? null : type)));

            let desc = Translation.getCommand('history.embed.description', locale).replaceAll('{0}', user) + '\n\n';
            if (docs.length < 1) desc = Translation.getError('not_found.punishments.for_user', locale).replaceAll('{0}', user);

            for (let doc in docs) {
                doc = docs[doc];
                let log = `**ID**: ${doc['_id']}\n` +
                    `**${Translation.get('punishment.type.p_type', locale)}**: ${doc['type']}\n` +
                    `**${Translation.get('punishment.by', locale)}**: ${message.guild.member(doc['punisher'])}\n` +
                    `**${Translation.get('punishment.date', locale)}**: ${doc['when'].toLocaleDateString('en', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}\n` +
                    `**${Translation.get('punishment.type.perm', locale)}**: ${Translation.get(doc['permanent'] ?
                        Translation.get('yes', locale) : Translation.get('not', locale), locale)}\n` +
                    (!doc['permanent'] ? `**${Translation.get('punishment.for')}**: ${ms(doc['time'], {long: true})}\n` : '') +
                    `**${Translation.get('reason', locale)}**: ${doc['reason']}\n\n`;

                desc += log;
            }

            embed.setDescription(desc);
            channel.send(embed);
        })
    }
}

module.exports = History;