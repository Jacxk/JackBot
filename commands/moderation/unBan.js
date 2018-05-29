const muteUtils = require('../../utilities/banUtils.js');
const messageUtil = require('../../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    if (message.channel.type === "dm") return message.channel.send('You need to use this command inside the guild.');
    message.delete().catch(err => console.log(err));

    if (args.length <= 1) return messageUtil.wrongUsage(message.channel, 'unBan [@User]', 'unBan @By_Jack#0047');

    let memberToBan = args[1];

    if (!memberToBan) return messageUtil.specifyUser(message.channel);

    muteUtils.unBan(memberToBan, message);
};

module.exports.command = {
    name: 'unban',
    permission: "BAN_MEMBERS",
    description: "Is someone banned and you want to unban him? Why you banned him then?",
    enabled: false
};