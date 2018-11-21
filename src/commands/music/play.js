const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');
const prettyMs = require('pretty-ms');
const isUrl = require('is-url');

const CachedData = require('../../database/CachedData.js');
const Discord = require('discord.js');
let isPlaying = false;

class Play extends Command {
    constructor() {
        super('play');
        this.setDescription('play.description');
        this.setUsage('<song | url>');
        this.setCategory('music');
    }

    async execute(message, args, client) {
        const embed = new Discord.RichEmbed().setColor('ORANGE');
        const channel = message.channel;
        const member = message.member;
        if (args.length < 1) return MessageUtil.sendWrongUsage(channel, this.getUsage(), 'play random cat sounds');
        if (!member || !member.voiceChannel) return MessageUtil.sendError(Translation.getError('user_not_voice_channel'), channel);

        let url = isUrl(args.join(' ').trim());
        let song = await client.getSongs(args.join(' ').trim(), url);

        if (song.error) return MessageUtil.sendError(song.error, channel);

        const music_settings = CachedData.music_settings[message.guild.id];

        const time_limit = music_settings ? music_settings.time_limit : client.config.music.time_limit;
        const queue_limit = music_settings ? music_settings.queue_limit : client.config.music.queue_limit;
        const song_display_limit = music_settings ? music_settings.song_display_limit : client.config.music.song_display_limit;

        const queue = client.queue;
        let queueArray = [];

        if (queue.get(message.guild.id)) queueArray = queue.get(message.guild.id);

        if (queueArray.length > queue_limit) return MessageUtil.sendError(Translation.getError('song_limit')
            .replaceAll('{0}', `**${queue_limit}**`), channel);

        const tracksAvailable = await getTracksAvailable(song, song_display_limit, time_limit);

        if (tracksAvailable.error) return MessageUtil.sendError(tracksAvailable.message, channel);

        if (url) {
            let tracks = {};

            if (song["loadType"] === 'PLAYLIST_LOADED') {
                // add check if user has a role to play a playlist
                tracks = tracksAvailable.trackList.tracks;
                tracks.forEach(track => track.requestedBy = member.displayName);
                queueArray = queueArray.concat(tracks);

                tracks = tracks[0];
            } else {
                tracks = tracksAvailable.trackList.tracks[0];
                tracks.requestedBy = member.displayName;
                queueArray.push(tracks);
            }

            queue.set(message.guild.id, queueArray);
            playSong(tracks, client, message, queueArray, embed);
            return;
        }

        channel.send(tracksAvailable.embed).then(msg => {
            const filter = m => (!isNaN(m.content) || m.content === 'cancel') && m.author.id === message.author.id;
            channel.awaitMessages(filter, {max: 1, time: time_limit * 1000, errors: ['time']}).then(collected => {
                msg.delete();

                if (collected.first().content === 'cancel') {
                    embed.setTitle("").setDescription(Translation.getCommand('play.select_song.cancelled'));
                    return channel.send(embed);
                }

                const chosen = parseInt(collected.first().content);
                const tracks = tracksAvailable.trackList.tracks[chosen - 1];

                tracks.requestedBy = member.displayName;
                queueArray.push(tracks);

                queue.set(message.guild.id, queueArray);

                playSong(tracks, client, message, queueArray, embed, false);
            }).catch(() => {
                msg.delete();
                MessageUtil.sendError(Translation.getError('times_up'), channel);
            });
        });
    }
}

async function getTracksAvailable(song, max, time_limit) {
    const embed = new Discord.RichEmbed().setColor('ORANGE');
    if (song["loadType"] === 'NO_MATCHES') {
        return {error: true, message: Translation.getError('not_found.song')};
    }
    const tracks = song["tracks"];
    let trackList = {trackList_toString: '', tracks: []};

    for (let i = 0; i < tracks.length; i++) {
        function setTrackListString() {
            let track = tracks[i];
            const duration = prettyMs(track.info.length, {verbose: true});

            trackList.tracks.push(track);
            trackList.trackList_toString += `${trackList.tracks.length}: **${track.info.title}** by *${track.info.author}* - \`${duration}\`\n`;

        }

        await setTrackListString();
        if (song['loadType'] !== 'PLAYLIST_LOADED' && i === (max - 1)) break;
    }

    embed.setTitle(Translation.getCommand('play.select_song.title'))
        .setDescription(!trackList.trackList_toString ? Translation.getError('track_list') : trackList.trackList_toString)
        .setFooter(Translation.getCommand('play.select_song.footer').replaceAll('{0}', `${time_limit}`));

    return {embed: embed, trackList: trackList};
}

function playSong(song, client, message, queueArray, embed) {
    if (timeout) clearTimeout(timeout);

    const channel = message.channel;
    const member = message.member;

    let player = client.playerManager.get(message.guild.id);
    if (!player) player = client.playerManager.join({
        guild: message.guild.id,
        channel: message.member.voiceChannelID,
        host: 'localhost'
    }, {selfdeaf: true});

    if (queueArray.length === 1) {
        player.play(queueArray[0].track);
        channel.send(nowPlayingMessage(embed, song, member.displayName));
        isPlaying = true;
    } else if (queueArray.length > 1) {
        if (!isPlaying) player.play(queueArray[0].track);
        channel.send(addQueueMessage(embed, song, member.displayName));
    }

    player.volume(80);

    player.once("error", (error) => {
        console.log(error);
        player.leave(message.guild.id);
        return MessageUtil.sendError(error, channel);
    });

    player.once("end", data => {
        if (data.reason === "REPLACED") return;
        nextSong(client, message, player);
    });
}

const nextSong = module.exports.nextSong = function (client, message, player, skipAmount = 1) {
    const embed = new Discord.RichEmbed().setColor('ORANGE');
    let queueArray = client.queue.get(message.guild.id);

    queueArray = queueArray.slice(skipAmount);
    client.queue.set(message.guild.id, queueArray);

    if (queueArray.length >= 1) {
        player.play(queueArray[0].track);
        player.once("end", data => {
            if (data.reason === "REPLACED") return;
            nextSong(client, message, player);
            isPlaying = true;
        });

        message.channel.send(nowPlayingMessage(embed, queueArray[0], message.member.displayName));
    } else {
        embed.setTitle('Empty Queue').setDescription(Translation.getCommand('play.empty_queue'));
        leaveChannel(client.playerManager, message.guild.id);
        message.channel.send(embed.setThumbnail(""));
        isPlaying = false;
    }
};

function nowPlayingMessage(embed, song, member) {
    const duration = prettyMs(song.info.length, {verbose: true});
    return embed.setDescription(Translation.get('words.now_playing_long')
        .replaceAll('{0}', `**${song.info.title}**`)
        .replaceAll('{1}', `*${duration}*`)
        .replaceAll('{2}', `**${member}**`))
        .setThumbnail(`https://img.youtube.com/vi/${song.info.identifier}/maxresdefault.jpg`);
}

function addQueueMessage(embed, song, member) {
    return embed.setTitle('Queue List').setDescription(Translation.getCommand('play.added_to_queue')
        .replaceAll('{0}', '**' + member + '**')
        .replaceAll('{1}', '**' + song.info.title + '**'))
        .setThumbnail(`https://img.youtube.com/vi/${song.info.identifier}/maxresdefault.jpg`);
}

let timeout;

function leaveChannel(playerManager, id) {
    timeout = setTimeout(() => {
        if (playerManager.get(id)) playerManager.leave(id);
    }, 60 * 1000);
    return timeout;
}

module.exports = Play;