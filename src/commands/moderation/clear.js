const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');

class Clear extends Command {
    constructor() {
        super('clear', ["purge"]);
        this.setUsage('<messages> <@user>');
        this.setCategory('Moderation');
        this.setPermission('MANAGE_MESSAGES')
    }

    async execute(message, args, client) {
        if (args.length < 1) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'clear 20 @By_Jack#0047');

        const messages = parseInt(args[0]);
        const channel = message.channel;
        if (isNaN(messages)) return MessageUtil.sendError(Translation.getError('invalid.number'), channel);
        const embed = new Discord.RichEmbed().setColor('GREEN').setTitle('Purging messages!');

        if (args.length === 2) {
            const memberMessages = message.mentions.members.first();
            channel.fetchMessages({limit: messages}).then(messages => {
                const collection = messages.filter(m => m.author.id === memberMessages.id);
                channel.bulkDelete(collection);
            }).catch(err => MessageUtil.sendError(err.stack, channel));

            embed.setDescription(Translation.getCommand('clear.success.from_user').replaceAll('{0}', messages)
                .replaceAll('{1}', memberMessages));
        } else {
            embed.setDescription(Translation.getCommand('clear.success.user').replaceAll('{0}', messages));
            channel.bulkDelete(messages);
        }

        channel.send(embed).then(m => m.delete(5000));
    }
}

module.exports = Clear;