const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');

class Kick extends Command {
    constructor() {
        super('kick');
        this.setDescription('kick.description');
        this.setUsage('<user> <reason>');
        this.setCategory('Moderation');
        this.setPermission('KICK_MEMBERS')
    }

    async execute(message, args, client) {
        if (args.length === 1) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'kick @By_Jack#0047 YOLO!');

        let memberToKick = message.mentions.members.first() || message.guild.member(args[0]);

        if (!memberToKick) return MessageUtil.sendNoUserFound(message.channel);
        if (memberToKick === message.member) return MessageUtil.sendNoSelfPunishment(message.channel);
        if (message.member.id !== message.member.guild.ownerID && memberToKick.highestRole.position >= message.member.highestRole.position)
            return MessageUtil.sendSameRankOrHigher(message.channel);

        client.setup.incidents.get(message.guild.id).createKick(message.member, memberToKick, args.slice(1).join(' ') || "N/A")
    }
}

module.exports = Kick;