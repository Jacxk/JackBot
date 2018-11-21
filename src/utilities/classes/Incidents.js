const Discord = require('discord.js');
const ms = require('ms');

const Translation = require('./Translation.js');
const MessageUtil = require('./MessageUtil.js');

const Punish = require('../../database/Database.js').Punish;

class Incidents {

    constructor(guild, lang, channel, muteRole) {
        this._lang = lang;
        this._channel = channel;
        this._userRoles = new Discord.Collection();
        this._muteRole = muteRole;
    }

    createBan(staff, member, reason, time = 0) {
        const embed = new Discord.RichEmbed().setColor("ORANGE");
        embed.setTitle(Translation.getBans('new_ban', this._lang));
        embed.setDescription(`**${Translation.getBans('user_banned.user', this._lang)}**: ${member}` +
            `\n**${Translation.getBans('user_banned.by', this._lang)}**: ${staff}` +
            `\n**${Translation.getBans('user_banned.when', this._lang)}**: ${Incidents.getFormattedDate()}` +
            `${time !== 0 ? `\n**${Translation.getBans('user_banned.time', this._lang)}**: ${ms(time)}` : ''}` +
            `\n**${Translation.getBans('user_banned.reason', this._lang)}**: ${reason}` +
            `\n**${Translation.get('punishment.type.p_type', this._lang)}**: ` +
            `**${Translation.get(time === 0 ? 'punishment.type.perm' : 'punishment.type.temp', this._lang)}`
        );

        if (reason === 'test') this._channel.send(embed);
        else member.ban({reason: reason}).then(() => {
            this._channel.send(embed);
            member.send(Translation.get('punishment.dm_punishment').replaceAll('{0}', Translation.get('words.ban'))
                .replaceAll('{1}', reason));
            Punish.ban(staff, member, reason, time);
        });
    }

    createKick(staff, member, reason) {
        const embed = new Discord.RichEmbed().setColor("ORANGE");
        embed.setTitle(Translation.getKicks('new_kick', this._lang));
        embed.setDescription(`**${Translation.getKicks('user_kicked.user', this._lang)}**: ${member}` +
            `\n**${Translation.getKicks('user_kicked.by', this._lang)}**: ${staff}` +
            `\n**${Translation.getKicks('user_kicked.when', this._lang)}**: ${Incidents.getFormattedDate()}` +
            `\n**${Translation.getKicks('user_kicked.reason', this._lang)}**: ${reason}`
        );

        if (reason === 'test') this._channel.send(embed);
        else member.kick(reason).then(() => {
            this._channel.send(embed);
            member.send(Translation.get('punishment.dm_punishment').replaceAll('{0}', Translation.get('words.kick'))
                .replaceAll('{1}', reason));
            Punish.kick(staff, member, reason);
        });
    }

    async createWarn(staff, member, reason) {
        Punish.warn(staff, member, reason);

        const embed = new Discord.RichEmbed().setColor("ORANGE");
        embed.setTitle(Translation.getWarns('new_warn', this._lang));
        embed.setDescription(`**${Translation.getWarns('user_warned.user', this._lang)}**: ${member}` +
            `\n**${Translation.getWarns('user_warned.by', this._lang)}**: ${staff}` +
            `\n**${Translation.getWarns('user_warned.when', this._lang)}**: ${Incidents.getFormattedDate()}` +
            `\n**${Translation.getWarns('user_warned.total_warns', this._lang)}**: ${await Punish.getPunishmentCount(member, 'warn')}` +
            `\n**${Translation.getWarns('user_warned.reason', this._lang)}**: ${reason}`
        );

        this._channel.send(embed);
        member.send(Translation.get('punishment.dm_punishment').replaceAll('{0}', Translation.get('words.warn.past'))
            .replaceAll('{1}', reason));
    }

    async createReport(reporter, member, reason) {
        Punish.report(reporter, member, reason);

        const embed = new Discord.RichEmbed().setColor("ORANGE");
        embed.setTitle(Translation.getReports('new_report', this._lang));
        embed.setDescription(`**${Translation.getReports('user_reported.user', this._lang)}**: ${member}` +
            `\n**${Translation.getReports('user_reported.by', this._lang)}**: ${reporter}` +
            `\n**${Translation.getReports('user_reported.when', this._lang)}**: ${Incidents.getFormattedDate()}` +
            `\n**${Translation.getReports('user_reported.total_reports', this._lang)}**: ${await Punish.getPunishmentCount(member, 'report')}` +
            `\n**${Translation.getReports('user_reported.reason', this._lang)}**: ${reason}`
        );

        this._channel.send(embed);
    }

    createMute(channel, staff, member, reason, time = 0) {
        if (!this._muteRole) return MessageUtil.sendError(Translation.getError('not_found.mute_role') + '\nhttps://jackbot.pw/', channel);
        if (member.roles.get(this._muteRole.id)) return MessageUtil.sendError(Translation.getError('done_before.is_muted'), channel);

        const embed = new Discord.RichEmbed().setColor("GREEN");
        embed.setTitle(Translation.getMute('new_mute', this._lang));
        embed.setDescription(`**${Translation.getMute('user_muted.user', this._lang)}**: ${member}` +
            `\n**${Translation.getMute('user_muted.by', this._lang)}**: ${staff}` +
            `\n**${Translation.getMute('user_muted.when', this._lang)}: ${Incidents.getFormattedDate()}` +
            `${time !== 0 ? `\n**${Translation.getMute('user_muted.time', this._lang)}**: ${ms(time)}` : ''}` +
            `\n**${Translation.getMute('user_muted.reason', this._lang)}**: ${reason}` +
            `\n**${Translation.get('punishment.type.p_type', this._lang)}**: ` +
            `${Translation.get(time === 0 ? 'punishment.type.perm' : 'punishment.type.temp', this._lang)}`
        );

        this._userRoles.set(member.id, member.roles);
        member.removeRoles(member.roles.filter(r => r.name !== '@everyone'))
            .catch(err => MessageUtil.sendError(err.toString(), channel));

        member.addRole(this._muteRole.id).then(() => {
            this._channel.send(embed);
            if (time !== 0) setTimeout(() => {
                member.removeRole(this._muteRole.id).then(() => {
                    member.addRoles(this._userRoles.get(member.id).filter(r => r.name !== '@everyone'))
                        .catch(err => MessageUtil.sendError(err.toString(), channel));
                }).catch(err => MessageUtil.sendError(err.toString(), channel));
            }, time);
        }).catch(err => MessageUtil.sendError(err.toString(), channel));
        Punish.mute(staff, member, reason, time);
    }

    static getFormattedDate(nextDate = 0) {
        return new Date(Date.now() + nextDate).toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

module.exports = Incidents;