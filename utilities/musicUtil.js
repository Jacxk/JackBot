const YTDL = require('ytdl-core');
const YouTubeAPI = require('simple-youtube-api');
const youtube = new YouTubeAPI(process.env.youtube);
const Discord = require('discord.js');
const messageUtil = require('../utilities/messageUtil.js');

let servers = {};
let currentSongEmbed;

module.exports.play = (message, args,) => {
    if (args.length <= 1) return messageUtil.wrongUsage(message.channel, 'play [song name/url]', 'play Drake - Gods Plan');

    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    };

    if (/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/.test(args[1])) {
        youtube.getVideo(args[1]).then(results => {
            play(message, results);
        });
    } else youtube.search(args.slice(1).join(' '), 1).then(results => {
        play(message, results);
    }).catch(err => messageUtil.sendError(message.channel, err.toString()));
};

module.exports.getQueue = (message) => {
    const server = servers[message.guild.id];
    if (!server) return messageUtil.sendError(message.channel, 'There are no songs in the queue');
    if (!server.queue[0]) return messageUtil.sendError(message.channel, 'There are no songs in the queue');

    const embed = new Discord.RichEmbed();
    let description = '';

    embed.setColor("BLUE").setTitle('Current Queue');
    embed.setFooter('Now Playing: ' + server.queue[0].song);

    server.queue.forEach((song, index) => {
        description += `**${index + 1}.** Song: **${song.song}**\nRequested by: **${song.user}**${server.queue[0].song === song.song ? ' `(Currently Playing)`' : ''}\n\n`;
    });

    embed.setThumbnail('https://media.giphy.com/media/l41Ym9sB9yaIsUWpa/giphy.gif');
    embed.setDescription(description);
    message.channel.send(embed);
};

module.exports.skip = (message) => {
    const server = servers[message.guild.id];

    if (!server) return messageUtil.sendError(message.channel, 'There are no songs in the queue.');

    const embed = new Discord.RichEmbed();
    embed.setColor("BLUE").setDescription(`The song: **${server.queue[0].song}** has been skipped`);

    if (server.dispatcher) server.dispatcher.end();

    message.channel.send(embed);
};

module.exports.setVolume = (message, args) => {
    if (args.length <= 1) return messageUtil.wrongUsage(message.channel, 'volume [number]', 'volume 50');
    if (isNaN(args[1])) return messageUtil.sendError(message.channel, 'Invalid number. Please try again.');

    const server = servers[message.guild.id];
    if (!server) return messageUtil.sendError(message.channel, 'There are no songs in the queue.');

    const embed = new Discord.RichEmbed();
    const volume = parseInt(args[1]) / 100;

    server.dispatcher.setVolume(volume);

    embed.setColor("BLUE").setDescription('Volume changed to ' + args[1] + '%');
    message.channel.send(embed);
};

module.exports.currentSong = (message) => {
    const server = servers[message.guild.id];
    if (!server) return messageUtil.sendError(message.channel, 'There are no songs in the queue.');
    if (!currentSongEmbed) return messageUtil.sendError(message.channel, 'There are no songs in the queue.');

    message.channel.send(currentSongEmbed);
};

function play(message, results) {
    if (!message.member.voiceChannel) return messageUtil.sendError(message.channel, 'Please join a voice channel first...');
    const server = servers[message.guild.id];

    let video;
    if (results[0]) video = results[0];
    else video = results;

    const embed = new Discord.RichEmbed();
    embed.setThumbnail(video.thumbnails.default.url);
    embed.setURL(video.url).setColor("DARK_RED");
    embed.setTitle(video.title);
    embed.addField('Channel', video.channel.title, true);
    embed.addField('Published Date', video.publishedAt.toDateString(), true);
    embed.addField('Requested by', message.author.tag, true);

    server.queue.push({url: video.url, user: message.author.tag, song: video.title});

    embed.addField('Queue', '#' + server.queue.length, true);
    embed.setFooter(video.url);

    currentSongEmbed = embed;

    if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
        addTOQueue(connection, message.guild.id, video.url)
    }).catch(err => messageUtil.sendError(message.channel, err.toString()));

    message.channel.send(embed);
}

function addTOQueue(connection, id, url) {

    const server = servers[id];

    server.dispatcher = connection.playStream(YTDL(url, {filter: 'audioonly'}));

    server.dispatcher.on('end', () => {
        server.queue.shift();
        if (server.queue.length > 0) addTOQueue(connection, id, server.queue[0].url);
        else connection.disconnect();
    });
}
