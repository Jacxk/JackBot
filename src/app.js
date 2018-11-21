const Discord = require('discord.js');
const client = new Discord.Client({fetchAllMembers: true});

const config = require('./config.js');
const setup = require('./utilities/setup.js');

client.queue = new Discord.Collection();

client.on('ready', () => {
    client.user.setActivity('WIP', {type: "WATCHING"}).catch(console.error);
    client.user.setStatus("dnd").catch(console.error);

    console.log(client.user.tag + ' is now online!');
    setup.load(config, client).catch(console.error);

    client.setup = setup;
});

client.login(config.bot_token).catch(err => console.error(err));

String.prototype.replaceAll = function (search, replacement) {
    function escapeRegExp(string){
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    let target = this;
    return target.replace(new RegExp(escapeRegExp(search), 'g'), replacement);
};

process.on('SIGINT', () => {
    client.guilds.forEach(guild => {
        if (client.playerManager.get(guild.id)) client.playerManager.leave(guild.id);
    });

    console.log('Shutting down the bot');
    process.exit();
});

process.on('SIGHUP', () => process.emit('SIGINT'));
process.on('SIGTERM', () => process.emit('SIGINT'));
process.on('error', (error) => console.error(error.stack));

