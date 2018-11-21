const Translation = require('./Translation.js');
const Discord = require('discord.js');

class MessageUtil {
    static sendError(error, channel) {
        const embed = new Discord.RichEmbed();
        embed.setColor('RED');
        embed.setDescription(error);
        embed.setTitle(Translation.getError('error_occurred'));
        channel.send(embed);
    }

    static sendNoPermission(channel) {
        this.sendError(Translation.getError('no_perms'), channel);
    }

    static sendDisabledCommand(channel) {
        this.sendError(Translation.getError('disabled.global'), channel);
    }

    static sendNoSelfPunishment(channel) {
        this.sendError(Translation.getError('self_punish'), channel);
    }

    static sendNoUserFound(channel) {
        this.sendError(Translation.getError('not_found.user'), channel);
    }

    static sendSameRankOrHigher(channel) {
        this.sendError(Translation.getError('same_rank_or_higher'), channel);
    }

    static sendWrongUsage(channel, usage, example) {
        this.sendError(`${Translation.getError('wrong_usage')}\n\n${Translation.get('usage')}: ${usage}\n${Translation.get('example')}: ${example}`, channel);
    }
}

module.exports = MessageUtil;