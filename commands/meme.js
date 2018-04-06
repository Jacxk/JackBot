const Discord = require('discord.js');
const request = require('request');
const messageUtil = require('../utilities/messageUtil.js');

module.exports.run = (message, args) => {
    generateMeme(message, args);
};

function generateMeme(message, args) {
    request(`https://www.reddit.com/r/${args.length === 2 ? args[1] : "PewdiepieSubmissions"}/.json`, (err, resp, data) => {
        if (err) return console.log(err);
        let jsonData = JSON.parse(data);

        if (jsonData.message) return messageUtil.sendError(message.channel, jsonData.message);

        let meme = jsonData.data.children;

        let randomNumber = Math.floor(Math.random() * meme.length);

        let imageData = meme[randomNumber].data;
        let url = imageData.url;
        let extArr = ['.png', '.jpg', '.gif'];

        if (extArr.includes(url)) return generateMeme(message, args);

        let embed = new Discord.RichEmbed();
        embed.setColor("RANDOM");
        embed.setImage(url);
        embed.setTitle(imageData.title);
        embed.setFooter("Powered by: www.reddit.com/r/" + (args.length === 2 ? args[1] : "PewdiepieSubmissions"));

        message.channel.send(embed);
    });
}

module.exports.command = {
    name: 'meme',
    permission: "none",
    enabled: true
};