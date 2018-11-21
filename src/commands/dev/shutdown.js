const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Shutdown extends Command {
    constructor() {
        super('shutdown');
        this.setDescription('Shutdown the bot');
        this.setDevOnly(true);
    }

    async execute(message, args, client) {
        async function stop() {
            message.channel.send(`Shutting down **${client.user.tag}**!`);
            await exec('npm run pm2_stop');
        }

        stop().catch(err => MessageUtil.sendError(err.toString(), message.channel));
    }
}

module.exports = Shutdown;