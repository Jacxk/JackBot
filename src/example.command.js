const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');

class CHANGE extends Command {
    constructor() {
        super('CHANGE');
        this.setDescription('CHANGE');
        this.setUsage('CHANGE');
        this.setCategory('CHANGE');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const member = message.member;
        const embed = new Discord.RichEmbed();

    }
}

module.exports = CHANGE;