const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');

class Report extends Command {
    constructor() {
        super('report');
        this.setDescription('report.description');
        this.setUsage('<user> <reason>');
        this.setCategory('Moderation');
    }

    async execute(message, args, client) {
        if (args.length < 2) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'report @By_Jack#0047 YEET!');

        let memberToReport = message.mentions.members.first() || message.guild.member(args[0]);

        if (!memberToReport) return MessageUtil.sendNoUserFound(message.channel);
        if (memberToReport === message.member) return MessageUtil.sendNoSelfPunishment(message.channel);
        if (message.member.id !== message.member.guild.ownerID) return MessageUtil.sendSameRankOrHigher(message.channel);

        client.setup.incidents.get(message.guild.id).createReport(message.member, memberToReport, args.slice(1).join(' '))
            .catch(err => MessageUtil.sendError(err.toString(), message.channel))
    }
}

module.exports = Report;