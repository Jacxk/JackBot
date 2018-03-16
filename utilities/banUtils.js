const Discord = require('discord.js');
const ms = require('ms');

let timeOut;
const tempBan = module.exports.tempMute = (args, memberToMute, message) => {
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
            message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
                .setDescription(`The member ${memberToBan} is already banned`))
                .then(msg => msg.delete(10 * 1000));
        } else {
            memberToBan.ban({reason: args}).catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
            message.channel.send(embed.setColor("GREEN").setTitle('🔇 BAN REPORT 🔇')
                .setDescription(`The member ${memberToBan.user.tag ? memberToBan.user.tag : memberToBan} has been banned.`))
                .then(msg => msg.delete(10 * 1000));
            sendBanEmbed(args, message.guild, message.member, memberToBan,
                "http://i.dawn.com/large/2015/03/55138188b5b6c.jpg", duration, isTemp);
        }
    }).catch(err => message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('Could not find the user ' + memberToBan)).then(msg => msg.delete(10 * 1000)));
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
            }).catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
            if (timeOut) clearTimeout(timeOut);
        } else {
            message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(`The member ${memberToBan} is not banned`))
                .then(msg => msg.delete(10 * 1000));
        }
    }).catch(err => message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('Could not find the user ' + memberToBan)).then(msg => msg.delete(10 * 1000)));
};

function sendBanEmbed(args, guild, staffMember, bannedMember, url, duration, isTemp) {
    if (args.length < 2) return;

    let reason = [];
    for (let i = (isTemp ? 3 : 2); i < args.length; i++) {
        reason.push(args[i]);
    }

    const embed = new Discord.RichEmbed().setColor("AQUA")
        .setTitle('📃 BAN REPORT 📃').addField("Staff Member Tag", staffMember.user.tag, true)
        .addField("Staff Member ID", staffMember.id, true).addField("Banned User Tag", bannedMember.user.tag, true)
        .addField("Banned User ID", bannedMember.id, true).addField("Issue Date", new Date().toDateString(), true)
        .addField("Ban Duration", duration, true)
        .addField("Reason", reason ? `**${reason.join(' ')}**` : "Not Specified")
        .setThumbnail(url);

    let channel = guild.channels.find('name', "incidents");
    if (!channel) {
        guild.createChannel("incidents", "text").then(channel.send(embed))
            .catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
    } else channel.send(embed);
}