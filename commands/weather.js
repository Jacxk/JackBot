const Discord = require('discord.js');
const request = require('request');

module.exports.run = (message, args) => {
    let embed = new Discord.RichEmbed();

    if (args.length < 2) return message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('Please specify a city')).then(m => m.delete(5000));

    let city = args.slice(1).join('%20');
    request('https://www.metaweather.com/api/location/search/?query=' + city, (err, resp, data) => {
        if (err) return message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));

        let jsonData = JSON.parse(data);

        if (jsonData.length === 0) return message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
            .setDescription('City not found... Try another one.')).then(m => m.delete(5000));

        let cityID = jsonData[0].woeid;
        request('https://www.metaweather.com/api/location/' + cityID, (err, resp, data) => {
            if (err) return message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));


            let jsonData = JSON.parse(data);
            let weather = jsonData.consolidated_weather;

            embed.setColor('GOLD').setTitle(jsonData.title + '\'s Weather in the next few days')
                .setFooter('Powered by www.metaweather.com/')
                .setThumbnail('https://images-na.ssl-images-amazon.com/images/I/41wkG24yDkL.png');

            weather.forEach(day => {
                let weatherState = day.weather_state_name;
                let min_temp = Math.round(day.min_temp * 9/5 + 32);
                let max_temp = Math.round(day.max_temp * 9/5 + 32);
                let predictability = day.predictability;
                let parts = day.applicable_date.split('-');
                let mydate = new Date(parts[0], parts[1] - 1, parts[2]);

                embed.addField(mydate.toDateString(), `Weather: ${weatherState}\n` +
                    `Temp Min: ${min_temp}°F\nTemp Max: ${max_temp}°F\nPredictability: ${predictability}%`, true);
            });

            message.channel.send(embed);
        });

    });

};

module.exports.command = {
    name: 'weather'
};