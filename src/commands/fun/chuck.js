const Command = require('../../utilities/classes/Command.js');
const got = require('got');

const Discord = require('discord.js');

class chuck extends Command {
    constructor() {
        super('joke');
        this.setCategory('Fun');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const embed = new Discord.RichEmbed();

        const {body} = await got('https://geek-jokes.sameerkumar.website/api');

        embed.setColor('RANDOM').setDescription(body);

        channel.send(embed)
    }
}

module.exports = chuck;