const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Reload extends Command {
    constructor() {
        super('restart');
        this.setDescription('Restart the bot');
        this.setDevOnly(true);
    }

    async execute(message, args, client) {
        async function restart() {
            message.channel.send(`Restarting **${client.user.tag}**!`);
            await exec('npm run pm2_restart');
        }

        restart().catch(err => MessageUtil.sendError(err.toString(), message.channel));
    }
}

module.exports = Reload;