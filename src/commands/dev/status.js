const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');


class Status extends Command {
    constructor() {
        super('status');
        this.setDescription('Set the bot status to whatever you want.');
        this.setDevOnly(true);
    }

    async execute(message, args, client) {
		if (args.length < 1) return;
		client.user.setActivity(args.join(' ')).catch(error=>MessageUtil.sendError(error.toString(), message.channel))
    }
}

module.exports = Status;