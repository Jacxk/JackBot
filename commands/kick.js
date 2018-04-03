const Discord = require('discord.js');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    message.delete().catch(err => console.log(err.toString()));

    if (!message.member.hasPermission("KICK_MEMBERS")) return messageUtil.noPermissionMessage(message);

    if (args.length === 1 || args.length === 2)
        return messageUtil.wrongUsage(message.channel, 'kick [@User] [reason]', 'kick @By_Jack#0047 Swearing in the chat');

    const memberToKick = message.mentions.members.first();
    const staffMember = message.member;

    if (!memberToKick) return messageUtil.specifyUser(message.channel);
    if (memberToKick.highestRole.position >= staffMember.highestRole.position) return messageUtil.sameRankOrHigher(message.channel);

    let reason = args.slice(2).join(" ");
    memberToKick.kick(reason).then(() => {
        let channel = message.guild.channels.find('name', "incidents");
        if (!channel) return message.channel.send("Please create a text channel called `incidents`");

        const embed = new Discord.RichEmbed().setColor("PURPLE")
            .setTitle('📃 KICK REPORT 📃').addField("Staff Member Tag", staffMember.user.tag, true)
            .addField("Staff Member ID", staffMember.id, true).addField("Kicked User Tag", memberToKick.user.tag, true)
            .addField("Kicked User ID", memberToKick.id, true).addField("Issue Date", new Date().toDateString(), true)
            .addField("Reason", reason)
            .setThumbnail('http://www.keysigns.co.uk/images/hazard-warning-safety-signs-p1254-38488_zoom.jpg');

        channel.send(embed);
    }).catch(err => messageUtil.sendError(message.channel, err.toString()));

};

module.exports.command = {
    name: 'kick',
    aliases: ["k"]
};