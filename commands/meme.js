const Discord = require('discord.js');
const request = require('request');
let watchedMemes = [];

module.exports.run = (message, args) => {
    generateMeme(message);
};

function generateMeme(message) {
    request("https://www.reddit.com/r/PewdiepieSubmissions/.json", (err, req, data) => {
        let jsonData = JSON.parse(data);
        let meme = jsonData.data.children;

        let randomNumber = Math.floor(Math.random() * meme.length);

        if (watchedMemes.includes(randomNumber)) return generateMeme(message);

        let imageData = meme[randomNumber].data;
        let url = imageData.url;

        let embed = new Discord.RichEmbed();
        embed.setColor("RANDOM");
        embed.setImage(url);
        embed.setTitle(imageData.title);
        embed.setFooter("Powered by: www.reddit.com/r/memes");

        message.channel.send(embed);

        watchedMemes.push(randomNumber);
    });
}

module.exports.command = {
    name: 'meme'
};