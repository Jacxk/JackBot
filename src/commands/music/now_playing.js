const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

class CHANGE extends Command {
    constructor() {
        super('nowplaying', ["np", "nowp", "nplay"]);
        this.setDescription('nowplaying.description');
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

        const song = queueArray[0];
        const duration = prettyMs(song.info.length, {verbose: true});

        embed.setDescription(Translation.get('words.now_playing_long').replaceAll('{0}', `**${song.info.title}**`)
            .replaceAll('{1}', `*${duration}*`).replaceAll('{2}', `**${song.requestedBy}**`))
            .setThumbnail(`https://img.youtube.com/vi/${song.info.identifier}/maxresdefault.jpg`);
        channel.send(embed);
    }
}

module.exports = CHANGE;