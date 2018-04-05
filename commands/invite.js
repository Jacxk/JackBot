const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message) => {
    message.delete().catch(err => messageUtil.sendError(message.channel, err.toString()));
    message.author.send('https://discordapp.com/api/oauth2/authorize?client_id=292180812638715904&permissions=8&scope=bot')
        .catch(err => messageUtil.sendError(message.channel, 'Something weird occurred while sending you the invite link to your DM!'));
};

module.exports.command = {
    name: 'invite'
};