const Command = require('../../utilities/classes/Command.js');

class Status extends Command {
    constructor() {
        super('status');
        this.setDescription('Set the bot status to whatever you want.');
        this.setDevOnly(true);
    }

    async execute(message, args, client) {
		if (args.length < 1) return;
		await client.user.setActivity(args.join(' '));
		message.channel.send(`**Status changed to:** *${args.join(' ')}*`)
    }
}

module.exports = Status;