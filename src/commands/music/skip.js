const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');
const play = require('./play.js');

class CHANGE extends Command {
    constructor() {
        super('skip');
        this.setDescription('skip.description');
        this.setUsage('[amount]');
        this.setCategory('music');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const member = message.member;
        const embed = new Discord.RichEmbed().setColor("ORANGE");

        if (!member || !member.voiceChannel) return MessageUtil.sendError(Translation.getError('user_not_voice_channel'), channel);

        const queue = client.queue;
        let queueArray = queue.get(message.guild.id);

        if (!queueArray || queueArray.length < 1) return MessageUtil.sendError(Translation.getError('no_songs_queue'), channel);

        const player = client.playerManager.get(message.guild.id);

        if (!player) return MessageUtil.sendError(Translation.getError('not_found.player'), channel);

        embed.setDescription(Translation.getCommand('skip.skipping'));
        channel.send(embed);

        if (queueArray.length === 1) return player.stop();

        play.nextSong(client, message, player, parseInt(args[0]) || 1);

        /* queueArray = queueArray.slice(parseInt(args[0]) || 1);
         player.play(queueArray[0].track);
         queue.set(message.guild.id, queueArray);*/

        embed.setDescription(Translation.get('words.now_playing_long')
            .replaceAll('{0}', '*' + member + '*')
            .replaceAll('{1}', '**' + queueArray[0].info.title + '**'))
            .setThumbnail(`https://img.youtube.com/vi/${queueArray[0].info.identifier}/maxresdefault.jpg`);

        channel.send(embed);

    }
}

module.exports = CHANGE;