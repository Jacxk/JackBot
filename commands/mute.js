const Discord = require('discord.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return noPermString(message);

    let memberToMute = message.mentions.members.first();
    if (!memberToMute) return message.channel.send('Please specify an @user');

    let muteRole = message.member.guild.roles.find("name", "muted");

    if (!message.member.guild.roles.find("name", "muted")) {
        message.guild.createRole({
            name: 'muted',
            color: 'GREY',
            mentionable: false,
            permissions: ["READ_MESSAGE_HISTORY", "READ_MESSAGES"]
        }).then(role => {
            console.log(`Created role ${role}`);
            message.guild.channels.forEach(async (channel) => {
                await channel.overwritePermissions(role, {
                    ADD_REACTIONS: false,
                    SEND_MESSAGES: false,
                    SEND_TTS_MESSAGES: false,
                    SPEAK: false
                }).catch(console.error)
            });
        }).catch(console.error);
        message.channel.send('***Could not find the muted role... Creating it...***').then(msg => msg.delete(15 * 1000));
        setTimeout(() => {
            message.channel.send('***Role created... Please Try Once Again...***').then(msg => msg.delete(10 * 1000));
        }, 3 * 1000);
        return;
    }

    let embed = new Discord.RichEmbed();

    if (memberToMute.roles.find("name", "muted")) {
        memberToMute.removeRole(muteRole.id).catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
        message.delete();
        message.channel.send('**The user `' + memberToMute.displayName + '` has been un-muted**').then(msg => msg.delete(10 * 1000));
        sendReason(args, message, message.member, memberToMute, "User UnMute", "http://pluspng.com/img-png/mute-png-noun-project-200.png")
            .catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
    } else {
        memberToMute.addRole(muteRole.id).catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
        message.delete().catch(err => console.log(err));
        message.channel.send('**The user `' + memberToMute.displayName + '` has been muted**').then(msg => msg.delete(10 * 1000));
        sendReason(args, message, message.member, memberToMute, "User Mute", "http://pluspng.com/img-png/mute-png-noun-project-200.png")
            .catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
    }
};

async function sendReason(args, message, user, otherUser, description, url) {
    if (args.length < 2) return;

    let reason = [];
    for (let i = 2; i < args.length; i++) {
        reason.push(args[i]);
    }

    const embed = new Discord.RichEmbed()
        .setColor("AQUA")
        .setDescription(description)
        .addField("Issued by", user, true)
        .addField("Issued to", otherUser, true)
        .addField("Reason", (reason) ? `**${reason.join(' ')}**` : "Not Specified")
        .setThumbnail(url);

    let channel = message.guild.channels.find('name', "incidents");
    if (!channel) {
        await message.guild.createChannel("incidents", "text").then(channel.send(embed))
            .catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
    } else channel.send(embed);
}

function noPermString(message) {
    let embed = new Discord.RichEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor("RED");
    message.channel.send(embed).then(m => m.delete(1000 * 10));
    message.react('❌').catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
    message.delete(1000 * 10).catch(err => console.log(err));
}

module.exports.command = {
    name: 'mute'
};