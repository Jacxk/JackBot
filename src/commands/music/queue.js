const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

class CHANGE extends Command {
    constructor() {
        super('queue', ["q"]);
        this.setDescription('queue.description');
        this.setCategory('music');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const member = message.member;
        const embed = new Discord.RichEmbed().setColor('ORANGE');

        if (!member || !member.voiceChannel) return MessageUtil.sendError(Translation.getError('user_not_voice_channel'), channel);

        const queue = client.queue;
        const queueArray = queue.get(message.guild.id);

        if (!queueArray || queueArray.length < 1) return MessageUtil.sendError(Translation.getError('no_songs_queue'), channel);

        let queueList = '';

        queueArray.forEach((value, index) => {
            const duration = prettyMs(value.info.length, {verbose: true});

            queueList += `${index + 1}: ` + Translation.getCommand('queue.songs').replaceAll('{0}', `**${value.info.title}**`)
                    .replaceAll('{1}', `*${duration}*`).replaceAll('{2}', `**${value.requestedBy}**`) +
                `${index === 0 ? ` (${Translation.get('words.now_playing')})` : ''}\n`;
        });

        embed.setTitle(Translation.get('words.queue')).setDescription(queueList);
        channel.send(embed);
    }
}

module.exports = CHANGE;