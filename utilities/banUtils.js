const Discord = require('discord.js');
const mysqlUtil = require('../utilities/mysqlUtil.js');
const messageUtil = require('../utilities/messageUtil.js');
const ms = require('ms');

let timeOut;
module.exports.tempMute = (args, memberToMute, message) => {
    ban(memberToMute, message, args, true, args[1]);
    timeOut = setTimeout(() => {
        unBan(memberToMute, message, args);
    }, ms(args[1]))
};

const ban = module.exports.ban = (memberToBan, message, args, isTemp, duration) => {
    let embed = new Discord.RichEmbed();
    let guild = message.guild;
    guild.fetchBans().then(bans => {
        if (bans.get(memberToBan.id ? memberToBan.id : memberToBan)) {
            messageUtil.sendError(message.channel, `The member ${memberToBan} is already banned`);
        } else {
            memberToBan.ban({reason: args}).catch(err => messageUtil.sendError(message.channel, err.toString()));
            message.channel.send(embed.setColor("GREEN").setTitle('🔇 BAN REPORT 🔇')
                .setDescription(`The member ${memberToBan.user.tag ? memberToBan.user.tag : memberToBan} has been banned.`))
                .then(msg => msg.delete(10 * 1000));
            sendBanEmbed(args, message.guild, message.member, memberToBan,
                "http://i.dawn.com/large/2015/03/55138188b5b6c.jpg", duration, isTemp);
        }
    }).catch(err => message.channel.send(messageUtil.sendError(message.channel, 'Could not find the user ' + memberToBan))
        .then(msg => msg.delete(10 * 1000)));
};

const unBan = module.exports.unBan = (memberToBan, message) => {
    let embed = new Discord.RichEmbed();
    let guild = message.guild;
    guild.fetchBans().then(bans => {
        const bannedUser = bans.get(memberToBan);
        if (bannedUser) {
            guild.unBan(bannedUser).then(unBanned => {
                message.channel.send(embed.setColor("GREEN").setTitle('🔇 BAN REPORT 🔇')
                    .setDescription(`The member ${unBanned.user.tag} has been unBanned.`)).then(msg => msg.delete(10 * 1000));
            }).catch(err => messageUtil.sendError(message.channel, err.toString()));
            if (timeOut) clearTimeout(timeOut);
        } else {
            messageUtil.sendError(message.channel,`The member ${memberToBan} is not banned`);
        }
    }).catch(err => messageUtil.sendError(message.channel, err.toString()));
};

function sendBanEmbed(args, guild, staffMember, bannedMember, url, duration, isTemp) {
    if (args.length < 2) return;

    let reason = args.slice(isTemp ? 3 : 2).join(' ');

    let channel = guild.channels.get(mysqlUtil.getIncidentsChannel(guild.id));
    if (!channel) return;

    const embed = new Discord.RichEmbed().setColor("AQUA")
        .setTitle('📃 BAN REPORT 📃').addField("Staff Member Tag", staffMember.user.tag, true)
        .addField("Staff Member ID", staffMember.id, true).addField("Banned User Tag", bannedMember.user.tag, true)
        .addField("Banned User ID", bannedMember.id, true).addField("Issue Date", new Date().toDateString(), true)
        .addField("Ban Duration", duration, true)
        .addField("Reason", reason ? `**${reason.join(' ')}**` : "Not Specified")
        .setThumbnail(url);

     channel.send(embed);
}