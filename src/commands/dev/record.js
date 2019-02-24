const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');

const fs = require('fs');
const Discord = require('discord.js');

class Record extends Command {
    constructor() {
        super('record');
        this.setUsage('CHANGE');
        this.setCategory('CHANGE');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const member = message.member;
        const embed = new Discord.RichEmbed();

        if (!member.voiceChannel) throw "Member not in voice channel";
        const connection = await member.voiceChannel.join();
        const receiver = connection.createReceiver();
        const file = fs.createWriteStream('./test.mp3');

        receiver.on("warn", (reason, message) => {
            console.log(`reason - ${reason}. message - ${message}`);
        })
        receiver.on("opus", (user, buffer) => {
            console.log(`1: User: ${user}. Buffer: ${buffer}`);
        })
        receiver.on("pcm", (user, buffer) => {
            console.log(`2: User: ${user}. Buffer: ${buffer}`);
        })

        const readableStream = receiver.createOpusStream(member);

        readableStream.on('readable', function() {
            console.log(`readable: ${readableStream.read()}`);
        });
        readableStream.on('data', chunk => {
            console.log(`3: Received ${chunk.length} bytes of data.`);
            //file.write(chunk);
        });
        readableStream.on('end', () => {
            channel.send('Stream finished');
            //file.end();
        });
        channel.send('Started');
    }
}

module.exports = Record;