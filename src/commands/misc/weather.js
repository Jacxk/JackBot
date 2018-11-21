const Command = require('../../utilities/classes/Command.js');
const Translation = require('../../utilities/classes/Translation.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');

const Discord = require('discord.js');
const got = require('got');

class Weather extends Command {
    constructor() {
        super('weather', ["climate", "wea"]);
        this.setDescription('weather.description');
        this.setCategory('misc');
        this.setUsage('<city>');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const embed = new Discord.RichEmbed();

        if (args.length < 1) return MessageUtil.sendError('Specify city', channel);

        let city = args.join('%20');

        async function getCityId() {
            try {
                const {body} = await got('https://www.metaweather.com/api/location/search/?query=' + city, {json: true});

                if (body.length < 1) return MessageUtil.sendError('City no found', channel);

                return body[0].woeid;
            } catch (e) {
                MessageUtil.sendError(e.toString(), channel);
            }
        }

        try {
            const cityId = await getCityId();
            if (isNaN(cityId)) return;
            const {body} = await got('https://www.metaweather.com/api/location/' + cityId, {json: true});

            let weather = body.consolidated_weather;

            embed.setColor('GOLD').setTitle(body.title + '\'s Weather in the next few days')
                .setFooter('Powered by www.metaweather.com/')
                .setThumbnail('https://images-na.ssl-images-amazon.com/images/I/41wkG24yDkL.png');

            for (let i = 0; i < weather.length; i++) {
                let day = weather[i];

                let weatherState = day.weather_state_name;
                let min_temp = Math.round(day.min_temp * 9 / 5 + 32);
                let max_temp = Math.round(day.max_temp * 9 / 5 + 32);
                let predictability = day.predictability;
                let mydate = new Date(day.applicable_date);

                embed.addField(mydate.toDateString(), `Weather: ${weatherState}\n` +
                    `Temp Min: ${min_temp}°F\nTemp Max: ${max_temp}°F\nPredictability: ${predictability}%`, true);

            }

            channel.send(embed);

        } catch (e) {
            MessageUtil.sendError(e.toString(), channel);
        }
    }
}

module.exports = Weather;