const Discord = require('discord.js');
const mysqlUtil = require('../utilities/mysqlUtil.js');
const messageUtil = require('../utilities/messageUtil.js');
const ms = require('ms');

let timeOut;
module.exports.tempMute = (args, memberToMute, role, message) => {
    mute(memberToMute, role, message, args, true, args[1]);
    timeOut = setTimeout(() => {
        unMute(memberToMute, role, message, args);
    }, ms(args[1]))
};

module.exports.createMutedRole = (guild, channel, mutedRole, sendMessage) => {
    if (!mutedRole) {
        guild.createRole({
            name: 'Muted',
            color: 'GREY',
            mentionable: false,
            permissions: ["READ_MESSAGE_HISTORY", "READ_MESSAGES"]
        }).then(role => {
            console.log(`Created role ${role}`);
            guild.channels.forEach(async (channel) => {
                await channel.overwritePermissions(role, {
                    ADD_REACTIONS: false,
                    SEND_MESSAGES: false,
                    SEND_TTS_MESSAGES: false,
                    SPEAK: false
                }).catch(console.error)
            });
        }).catch(console.error);
        if (sendMessage) {
            messageUtil.sendError(channel, "Could not find the muted role... Creating it...");
        }
        return false;
    }
    return true;
};

const mute = module.exports.mute = (memberToMute, role, message, args, isTemp, duration) => {
    const embed = new Discord.RichEmbed();
    const channel = message.channel;

    if (memberToMute.roles.get(role.id)) {
        messageUtil.sendError(channel, `The member ${memberToMute.displayName} is already muted`);
    } else {
        memberToMute.addRole(role.id).catch(err => messageUtil.sendError(channel, err.toString()));
        channel.send(embed.setColor("GREEN").setTitle('🔇 MUTE REPORT 🔇')
            .setDescription(`The member ${memberToMute.user.tag} has been muted.`))
            .then(msg => msg.delete(10 * 1000));
        sendMuteEmbed(args, message.member, memberToMute,
            "http://pluspng.com/img-png/mute-png-noun-project-200.png", duration, isTemp);
    }
};

const unMute = module.exports.unMute = (memberToMute, role, message) => {
    const embed = new Discord.RichEmbed();
    const channel = message.channel;

    if (memberToMute.roles.get(role.id)) {
        memberToMute.removeRole(role.id).catch(err => messageUtil.sendError(channel, err.toString()));
        message.channel.send(embed.setColor("GREEN").setTitle('🔇 MUTE REPORT 🔇')
            .setDescription(`The member ${memberToMute.user.tag} has been unMuted.`)).then(msg => msg.delete(10 * 1000));
        if (timeOut) clearTimeout(timeOut);
    } else {
        messageUtil.sendError(channel, `The member ${memberToMute.displayName} is not muted`);
        message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription())
            .then(msg => msg.delete(10 * 1000));
    }
};

function sendMuteEmbed(args, guild, staffMember, mutedMember, url, duration, isTemp) {
    if (args.length < 2) return;

    let reason = args.slice(isTemp ? 3 : 2).join(' ');

    const embed = new Discord.RichEmbed().setColor("AQUA")
        .setTitle('📃 MUTE REPORT 📃').addField("Staff Member Tag", staffMember.user.tag, true)
        .addField("Staff Member ID", staffMember.id, true).addField("Muted User Tag", mutedMember.user.tag, true)
        .addField("Muted User ID", mutedMember.id, true).addField("Issue Date", new Date().toDateString(), true)
        .addField("Mute Duration", duration, true)
        .addField("Reason", reason)
        .setThumbnail(url);

    let channel = guild.channels.get(mysqlUtil.getIncidentsChannel(guild.id));
    if (!channel) return;

    channel.send(embed);
}
