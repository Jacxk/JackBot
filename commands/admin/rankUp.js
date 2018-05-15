const Discord = require('discord.js');
const messageUtil = require('../../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    message.delete();

    const channel = message.channel;
    if (args.length < 3) return messageUtil.wrongUsage(channel, 'rankUp [@user] [roleName]', 'rankup @By_Jack#0047 Administrator');

    let user = message.mentions.members.first();
    if (!user) return messageUtil.sendError(channel, 'You need to specify a user');

    let role = message.member.guild.roles.find("name", args.slice(2).join(" "));
    if (!role) return messageUtil.sendError(channel, 'That role does not exist. Try another one...');

    const embed = new Discord.RichEmbed()
        .setColor("AQUA")
        .setDescription(`Everybody welcome ${user} to ${role}. Congratulations.`);

    user.addRole(role).then(channel.send(embed)).catch(err => messageUtil.sendError(channel, err.toString()));
};

module.exports.command = {
    name: 'rankup',
    permission: "ADMINISTRATOR",
    enabled: true
};