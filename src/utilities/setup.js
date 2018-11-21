const {PlayerManager} = require("discord.js-lavalink");
const got = require('got');
const Discord = require('discord.js');
const fs = require('fs');

const incidents = new Discord.Collection();

const Database = require('../database/Database.js');
const CachedData = require('../database/CachedData.js');

const Incidents = require('./classes/Incidents.js');
const Translation = require('./classes/Translation.js');

function loadCommands(dir = '/commands/') {
    fs.readdir('./src' + dir, null, function (err, files) {
        if (err) return console.error(err);
        files.forEach(file => {
            if (fs.lstatSync(`./src${dir}${file}/`).isDirectory()) return loadCommands(`${dir}${file}/`);

            try {
                delete require.cache[require.resolve(`..${dir}${file}`)];
            } catch (e) {
                return console.log(e.stack)
            }

            let command = require(`..${dir}${file}`);
            command = new command();
            let name = command.getName();

            command.getAliases().forEach(alias => aliases.set(alias, name));
            commands.set(name, command);

            Database.Commands.setCommand(name, {
                name,
                description: command.getDescription(),
                permission: command.getPermission(),
                usage: command.getUsage(),
                category: command.getCategory(),
                aliases: command.getAliases()
            });
        });
    });
}

function registerEvents(client) {
    fs.readdir('./src/events', null, function (err, files) {
        if (err) return console.error(err);
        files.forEach(file => {
            try {
                delete require.cache[require.resolve('../events/' + file)];
            } catch (e) {
                return console.error(e.stack)
            }

            let event = require(`../events/${file}`);
            event = new event();
            client.on(event.getEventName(), event.execute.bind(null, client));
        });
    });
}

function cacheData(client) {
    client.guilds.forEach(guild => {
        Database.Prefix.getPrefix(guild.id, function (err, doc) {
            if (err) return console.error(err);
            if (!doc) return;
            CachedData.prefixes[guild.id] = doc.prefix;
        });
        incidents.set(guild.id, new Incidents(guild, 'english', guild.channels.find(c => c.name === 'general'),
            guild.roles.find(c => c.name === 'muted')))
    });
}


async function load(config, client) {
    Translation.loadFiles();
    setInterval(() => Translation.loadFiles(), config.language_refresh_rate * (60 * 1000));

    registerEvents(client);
    loadCommands();
    cacheData(client);

    client.config = config;

    client.playerManager = new PlayerManager(client, client.config.lavalink.nodes, {user: client.user.id});

    client.getSongs = async function (string, isUrl = false) {
        const host = client.config.lavalink.host, port = client.config.lavalink.port,
            pass = client.config.lavalink.password;
        const url = `http://${host}:${port}/loadtracks?identifier=${isUrl ? string : 'ytsearch:' + string}`;
        const res = await got(url, {headers: {"Authorization": pass}, json: true});
        if (!res) return {error: "There was an error, try again"};
        if (res.body.length < 1) return {error: "No tracks found"};
        return res.body;
    };

    client.getLocale = function (guildId) {
        const locale = CachedData.locale[guildId];
        if (locale) return Translation.languages.get(locale);
        else return config.default_language;
    };

    client.tictactoe = {matches: new Discord.Collection()};

    require('../database/connections/Configurations.js');
    require('../database/connections/Punishments.js');
}

module.exports = {
    aliases,
    commands,
    incidents,
    load,
    loadCommands,
    registerEvents
};