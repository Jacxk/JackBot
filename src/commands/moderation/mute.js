const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const ms = require('ms');

class Mute extends Command {
    constructor() {
        super('mute');
        this.setDescription('mute.description');
        this.setUsage('[time] <user> <reason>');
        this.setCategory('Moderation');
        this.setPermission('MUTE_MEMBERS')
    }

    async execute(message, args, client) {
        if (args.length === 1) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'mute 20m @By_Jack#0047 YOLO!');

        let memberToMute = message.mentions.members.first() || message.guild.member(args[0]) || message.guild.member(args[1]);

        if (!memberToMute) return MessageUtil.sendNoUserFound(message.channel);
        if (memberToMute === message.member) return MessageUtil.sendNoSelfPunishment(message.channel);
        if (message.member.id !== message.member.guild.ownerID && memberToMute.highestRole.position >= message.member.highestRole.position)
            return MessageUtil.sendSameRankOrHigher(message.channel);

        let reason;
        let time;

        if (!isNaN(parseInt(args[0].charAt(0))) && isNaN(parseInt(args[0].charAt(args[0].length - 1)))) {
            reason = args.slice(2).join(' ') || "N/A";
            time = ms(args[0]);
        } else reason = args.slice(1).join(' ') || "N/A";

        client.setup.incidents.get(message.guild.id).createMute(message.channel, message.member, memberToMute, reason, time)
    }
}

module.exports = Mute;