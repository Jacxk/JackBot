const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const ms = require('ms');

class Ban extends Command {
    constructor() {
        super('ban');
        this.setDescription('ban.description');
        this.setUsage('[time] <user> <reason>');
        this.setCategory('Moderation');
        this.setPermission('BAN_MEMBERS')
    }

    async execute(message, args, client) {
        if (args.length === 1) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'ban 60d @By_Jack#0047 YOLO!');

        let memberToBan = message.mentions.members.first() || message.guild.member(args[0]) || message.guild.member(args[1]);

        if (!memberToBan) return MessageUtil.sendNoUserFound(message.channel);
        if (memberToBan === message.member) return MessageUtil.sendNoSelfPunishment(message.channel);
        if (message.member.id !== message.member.guild.ownerID && memberToBan.highestRole.position >= message.member.highestRole.position)
            return MessageUtil.sendSameRankOrHigher(message.channel);

        let reason;
        let time;

        if (!isNaN(parseInt(args[0].charAt(0))) && isNaN(parseInt(args[0].charAt(args[0].length - 1)))) {
            reason = args.slice(2).join(' ') || "N/A";
            time = ms(args[0]);
        } else reason = args.slice(1).join(' ') || "N/A";

        client.setup.incidents.get(message.guild.id).createBan(message.member, memberToBan, reason, time)
    }
}

module.exports = Ban;