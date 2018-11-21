const joinLeaveThemes = require("../index.js").joinLeaveThemes;
const levelsystem = require('../utilities/levelSystem.js');
const client = require('../socket/client.js').client;

module.exports.run = (message, args, a, bot) => {

    if (args.length <= 1) return;
    const member = message.mentions.members.first() || message.member;

    switch (args[1]) {
        case 'join':
            joinLeaveThemes.get(args.length === 4 ? args[3] : 'default').join(member, message.channel);
            break;
        case 'leave':
            joinLeaveThemes.get(args.length === 4 ? args[3] : 'default').leave(member, message.channel);
            break;
        case 'event':
            bot.emit(args[2], member);
            break;
        case 'exp-add':
            levelsystem.addExp(member, parseInt(args[2]) || 5).then(exp => message.channel.send(exp));
            break;
        case 'exp-get':
            message.channel.send(levelsystem.getExp(member));
            break;
        case 'level-add':
            levelsystem.addLevel(member, 1).then(exp => message.channel.send(exp));
            break;
        case 'level-get':
            message.channel.send(levelsystem.getLevel(member));
            break;
        case 'stats':
            message.channel.send(levelsystem.getStats(member));
            break;
        case 'socket':
            if (!args[1]) return;
            client.emit('console:data:send:test', {
                guild_id: message.guild.id,
                guild_name: message.guild.name,
                message: args.slice(2).join(' '),
                member_name: message.member.displayName,
                member_tag: message.member.user.tag
            });
            break;
    }
};

module.exports.command = {
    name: 'debug',
    aliases: ['dbg', 'dbug'],
    permission: "ADMINISTRATOR",
    enabled: false
};