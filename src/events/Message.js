const MessageUtil = require('../utilities/classes/MessageUtil.js');
const Translation = require('../utilities/classes/Translation.js');
const CachedData = require('../database/CachedData.js');
const fs = require('fs');

class Message {
    constructor() {
        this._event = 'message';
    }

    execute(client, message) {
        if (message.channel.type === 'dm') return;
        if (message.author.bot) return;

        const config = client.config;
        const setup = client.setup;

        let prefix = CachedData.prefixes[message.guild.id] || config.default_prefix;
        let messageArray = message.content.split(' ');
        const args = messageArray.slice(1);

        if (!message.content.startsWith(prefix)) {
            if (!message.content.startsWith(client.user.toString())) {
                if (messageArray.length > 1) return;
                if (isNaN(messageArray[0])) return;

                const matches = client.tictactoe.matches;
                const match = matches.get(message.member);

                if (!match) return;
                message.delete(200);

                const move = parseInt(messageArray[0]);
                if (move < 1 || move > 9) return;

                match.makeMove(message.member, move, message.channel, matches);
                return;
            }
            if (args.length === 0) {
                message.reply(`The prefix of this guild is: **${prefix}**`);
            }
            else if (args.length > 0) prefix = client.user.toString() + ' ';
            return;
        }

        const cmd = messageArray[0].substring(prefix.length).toLowerCase();
        const member = message.member;
        const channel = message.channel;

        const command = setup.commands.get(setup.aliases.get(cmd) || cmd);
        if (!command) return;

        if (!command.isEnabled() && !config.dev_users.includes(member.id))
            return MessageUtil.sendError(Translation.getError('disabled.global', client.getLocale(message.guild.id)), channel);
        if (command.isDevOnly() && !config.dev_users.includes(member.id))
            return MessageUtil.sendNoPermission(channel);
        if ((command.getPermission() !== "N/A") && !member.hasPermission(command.getPermission()))
            return MessageUtil.sendNoPermission(channel);

        command.execute(message, args, client).catch(error => {
            const date = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

            console.log(date + ": There was an error... Please check the logs.");
            MessageUtil.sendError(error.toString() + '\nPlease contact the developer', channel);

/*
            const path = __dirname + `/../../logs/${date}.txt`;


            fs.writeFile(path, `${date}: ${error.stack.split('\n').join(`\n ${date}: `)}`, (e) => {
                if (e) return console.log(e);
            });
*/

        });
    }

    getEventName() {
        return this._event;
    }
}

module.exports = Message;