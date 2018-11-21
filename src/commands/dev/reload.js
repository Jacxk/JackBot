const Command = require('../../utilities/classes/Command.js');
const Translation = require('../../utilities/classes/Translation.js');

class Reload extends Command {
    constructor() {
        super('reload', ['rel']);
        this.setDescription('Reload all commands');
        this.setDevOnly(true);
    }

    async execute(message, args, client) {

        if (args.length < 1) {
            client.setup.loadCommands();
            const locale = client.getLocale(message.guild.id);
            message.channel.send(Translation.getSuccess('reload.commands', locale));
            return;
        }

        switch (args[0].toLowerCase()) {
            case "events": {
                client.setup.registerEvents(client);
                message.channel.send(Translation.getSuccess('reload.events', locale));
                break;
            }
        }
    }
}

module.exports = Reload;