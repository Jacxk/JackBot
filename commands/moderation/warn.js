const Discord = require('discord.js');
const messageUtil = require('../../utilities/messageUtil.js');
const mysqlUtil = require('../../utilities/mysqlUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    message.delete().catch(err => console.log(err.toString()));

    if (args.length === 1 || args.length === 2)
        return messageUtil.wrongUsage(message.channel, 'warn [@User] [reason]', 'warn @By_Jack#0047 Stop doing that...');

    const memberToWarn = message.mentions.members.first();
    const staffMember = message.member;

    if (!memberToWarn) return messageUtil.specifyUser(message.channel);
    if (memberToWarn.highestRole.position >= staffMember.highestRole.position) return messageUtil.sameRankOrHigher(message.channel);

    let channel = message.guild.channels.get(mysqlUtil.getIncidentsChannel(message.guild.id));
    if (!channel) return;

    const embed = new Discord.RichEmbed().setColor("GREEN")
        .setTitle('📃 WARN REPORT 📃').addField("Staff Member Tag", staffMember.user.tag, true)
        .addField("Staff Member ID", staffMember.id, true).addField("Warned User Tag", memberToWarn.user.tag, true)
        .addField("Warned User ID", memberToWarn.id, true).addField("Issue Date", new Date().toDateString(), true)
        .addField("Warning Message", args.slice(2).join(" "))
        .setThumbnail('http://www.keysigns.co.uk/images/hazard-warning-safety-signs-p1254-38488_zoom.jpg');

    channel.send(embed);
};

module.exports.command = {
    name: 'warn',
    aliases: ["wn", "w"],
    permission: "MANAGE_MESSAGES",
    description: "Warn a user because why not...",
    enabled: true
};