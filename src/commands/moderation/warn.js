const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');

class Warn extends Command {
    constructor() {
        super('warn');
        this.setDescription('warn.description');
        this.setUsage('<user> <reason>');
        this.setCategory('Moderation');
        this.setPermission('MANAGE_MESSAGES')
    }

    async execute(message, args, client) {
        if (args.length === 1) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'warn @By_Jack#0047 YEET!');

        let memberToWarn = message.mentions.members.first() || message.guild.member(args[0]);

        if (!memberToWarn) return MessageUtil.sendNoUserFound(message.channel);
        if (memberToWarn === message.member) return MessageUtil.sendNoSelfPunishment(message.channel);
        if (message.member.id !== message.member.guild.ownerID && memberToWarn.highestRole.position >= message.member.highestRole.position)
            return MessageUtil.sendSameRankOrHigher(message.channel);

        client.setup.incidents.get(message.guild.id).createWarn(message.member, memberToWarn, args.slice(1).join(' ') || "N/A")
            .catch(err => MessageUtil.sendError(err.toString(), message.channel))
    }
}

module.exports = Warn;