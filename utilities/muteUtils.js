const Discord = require('discord.js');
const ms = require('ms');

let timeOut;
const tempMute = module.exports.tempMute = (args, memberToMute, role, message) => {
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
            let embed = new Discord.RichEmbed();
            channel.send(embed.setTitle('❌ ERROR ❌').setDescription("***Could not find the muted role... Creating it...***")
                .setColor("RED")).then(msg => msg.delete(13 * 1000));
            setTimeout(() => {
                channel.send(embed.setTitle('❌ ERROR ❌').setDescription('***Role created... Please Try Once Again...***')
                    .setColor("RED")).then(msg => msg.delete(10 * 1000));
            }, 3 * 1000);
        }
        return false;
    }
    return true;
};

const mute = module.exports.mute = (memberToMute, role, message, args, isTemp, duration) => {
    let embed = new Discord.RichEmbed();
    if (memberToMute.roles.get(role.id)) {
        message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
            .setDescription(`The member ${memberToMute.displayName} is already muted`))
            .then(msg => msg.delete(10 * 1000));
    } else {
        memberToMute.addRole(role.id).catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
        message.channel.send(embed.setColor("GREEN").setTitle('🔇 MUTE REPORT 🔇')
            .setDescription(`The member ${memberToMute.user.tag} has been muted.`))
            .then(msg => msg.delete(10 * 1000));
        sendMuteEmbed(args, message.guild, message.member, memberToMute,
            "http://pluspng.com/img-png/mute-png-noun-project-200.png", duration, isTemp);
    }
};

const unMute = module.exports.unMute = (memberToMute, role, message) => {
    let embed = new Discord.RichEmbed();
    if (memberToMute.roles.get(role.id)) {
        memberToMute.removeRole(role.id).catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
        message.channel.send(embed.setColor("GREEN").setTitle('🔇 MUTE REPORT 🔇')
            .setDescription(`The member ${memberToMute.user.tag} has been unMuted.`)).then(msg => msg.delete(10 * 1000));
        if (timeOut) clearTimeout(timeOut);
    } else {
        message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(`The member ${memberToMute.displayName} is not muted`))
            .then(msg => msg.delete(10 * 1000));
    }
};

function sendMuteEmbed(args, guild, staffMember, mutedMember, url, duration, isTemp) {
    if (args.length < 2) return;

    let reason = [];
    for (let i = (isTemp ? 3 : 2); i < args.length; i++) {
        reason.push(args[i]);
    }

    const embed = new Discord.RichEmbed().setColor("AQUA")
        .setTitle('📃 MUTE REPORT 📃').addField("Staff Member Tag", staffMember.user.tag, true)
        .addField("Staff Member ID", staffMember.id, true).addField("Muted User Tag", mutedMember.user.tag, true)
        .addField("Muted User ID", mutedMember.id, true).addField("Issue Date", new Date().toDateString(), true)
        .addField("Mute Duration", duration, true)
        .addField("Reason", reason ? `**${reason.join(' ')}**` : "Not Specified")
        .setThumbnail(url);

    let channel = guild.channels.find('name', "incidents");
    if (!channel) {
        guild.createChannel("incidents", "text").then(channel.send(embed))
            .catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
    } else channel.send(embed);
}