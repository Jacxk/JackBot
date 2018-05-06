const Discord = require('discord.js');
const request = require('request');
const messageUtil = require('../../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    let embed = new Discord.RichEmbed();

    if (args.length < 2) return messageUtil.wrongUsage(message.channel, 'define [word] (some number)', 'define gtg');

    request('http://api.urbandictionary.com/v0/define?term=' + args[1], (err, req, data) => {
        let jsonData = JSON.parse(data);

        if (jsonData.result_type === 'no_results') return message.channel.send(embed.setColor('RED')
            .setTitle('❌ ERROR ❌').setDescription("No Results were found"));

        let definitions = jsonData.list;
        let defNumber = (args.length === 3 ? (isNaN(args[2]) ? 0 : parseInt(args[2])) : 0);
        if (defNumber > definitions.length) return message.channel.send(embed.setColor('RED')
            .setTitle('❌ ERROR ❌').setDescription(`Can't find the definition number ${defNumber}.` +
                `Try a number from 1 to ${definitions.length}...`));

        let def = definitions[defNumber].definition;
        let author = definitions[defNumber].author;
        let word = definitions[defNumber].word;
        let example = definitions[defNumber].example;
        let thumbs_up = definitions[defNumber].thumbs_up;
        let thumbs_down = definitions[defNumber].thumbs_down;

        embed.setAuthor('Requested by: ' + message.author.username, message.author.avatarURL)
            .setColor("DARK_AQUA")
            .addField('Word', word, true)
            .addField('Author', author, true)
            .addField('Thumbs Up', ':thumbsup: ' + thumbs_up, true)
            .addField('Thumbs Down', ':thumbsdown: ' + thumbs_down, true)
            .addField('Definition', def)
            .addField('Example Sentence', example)
            .setFooter('Powered by: www.UrbanDictionary.com')
            .setThumbnail('https://pbs.twimg.com/profile_images/838627383057920000/m5vutv9g.jpg');
        message.channel.send(embed).then(m => {
            m.react('👍').catch(err => console.log(err));
            m.react('👎').catch(err => console.log(err));
        });
    });
};

module.exports.command = {
    name: 'urbanDictionary',
    aliases: ['def', 'define', 'ud', 'urbandef', 'urband', 'udef'],
    permission: "none",
    enabled: true
};