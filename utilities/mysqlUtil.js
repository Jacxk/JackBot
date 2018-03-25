const Discord = require('discord.js');
const mysql = require('mysql');
const messageUtil = require('../utilities/messageUtil.js');
const sqlConfig = require('../mysqlConfig');
const prefixes = module.exports.prefixeMap = new Map();
const commandChannels = module.exports.commandChannelMap = new Map();

module.exports.connect = () => {
    createTable();
};

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    database: process.env.database,
    password: process.env.password

    /*host: sqlConfig.host,
    user: sqlConfig.user,
    database: sqlConfig.database,
    password: sqlConfig.password*/
});

const createTable = module.exports.createTable = () => {
    const statement = 'CREATE TABLE IF NOT EXISTS GuildSettings (ID int NOT NULL AUTO_INCREMENT, GuildId text, ' +
        'GuildName text, Prefix text, CommandChannel text, PRIMARY KEY (ID));';
    connection.query(statement, (err, result) => {
        if (err) return console.error(err);
    });
};

const changePrefix = module.exports.changePrefix = (channel, guild, prefix) => {
    const embed = new Discord.RichEmbed();
    const insertStatement = `INSERT INTO GuildSettings (GuildId, GuildName, Prefix) VALUES (?, ?, ?);`;
    const update = `UPDATE GuildSettings SET Prefix = ?, GuildName = ? WHERE GuildId = ?;`;
    containsGuild(guild).then(boolean => {
        if (!boolean) connection.query(insertStatement, [guild.id, guild.name, prefix], (err, result) => {
            console.log('Inserting prefix of ' + guild.id);
            if (err) return messageUtil.sendError(channel, 'Insert Error: ' + err.toString());
            prefixes.set(guild.id, prefix);
            channel.send(embed.setColor("GOLD").setTitle('Prefix Changed').setDescription('You have successfully changed the prefix to `' + prefix + '`'))
                .then(msg => msg.delete(20 * 1000));
        });
        else connection.query(update, [prefix, guild.name, guild.id], (err, result) => {
            console.log('Updating prefix of ' + guild.id);
            if (err) return messageUtil.sendError(channel, 'Update Error: ' + err.toString());
            prefixes.set(guild.id, prefix);
            channel.send(embed.setColor("GOLD").setTitle('Prefix Changed').setDescription('You have successfully changed the prefix to `' + prefix + '`'))
                .then(msg => msg.delete(20 * 1000));
        });
    }).catch(err => messageUtil.sendError(channel, err.toString()));
};

const changeCommandChannel = module.exports.changeCommandChannel = (channel, guild, ch) => {
    const embed = new Discord.RichEmbed();
    const insertStatement = `INSERT INTO GuildSettings (GuildId, GuildName, CommandChannel) VALUES (?, ?, ?);`;
    const update = `UPDATE GuildSettings SET CommandChannel = ?, GuildName = ? WHERE GuildId = ?;`;
    containsGuild(guild).then(boolean => {
        if (!boolean) connection.query(insertStatement, [guild.id, guild.name, ch.id ? ch.id : ch], (err, result) => {
            console.log('Inserting CommandChannel of ' + guild.id);
            if (err) return messageUtil.sendError(channel, 'Insert Error: ' + err.toString());
            commandChannels.set(guild.id, ch.id ? ch.id : ch);
            channel.send(embed.setColor("GOLD").setTitle('CommandChannel Changed').setDescription('You have successfully' +
                ' changed the CommandChannel to ' + ch)).then(msg => msg.delete(20 * 1000));
        });
        else connection.query(update, [ch.id ? ch.id : ch, guild.name, guild.id], (err, result) => {
            console.log('Updating CommandChannel of ' + guild.id);
            if (err) return messageUtil.sendError(channel, 'Update Error: ' + err.toString());
            commandChannels.set(guild.id, ch.id ? ch.id : ch);
            channel.send(embed.setColor("GOLD").setTitle('CommandChannel Changed').setDescription('You have successfully' +
                ' changed the CommandChannel to ' + ch)).then(msg => msg.delete(20 * 1000));
        });
    }).catch(err => messageUtil.sendError(channel, err.toString()));
};

const containsGuild = (guild) => new Promise((resolve, reject) => {
    const select = `SELECT * FROM GuildSettings WHERE GuildId = ?;`;
    connection.query(select, [guild.id], (err, result) => {
        if (err) resolve(false);
        else resolve(!!result[0]);
    });
});

module.exports.setPrefix = (guild) => new Promise((resolve, reject) => {
    containsGuild(guild).then(boolean => {
        if (!boolean) return;
        const select = `SELECT Prefix FROM GuildSettings WHERE GuildId = ?;`;
        connection.query(select, [guild.id], (err, result) => {
            prefixes.set(guild.id, result[0].Prefix);
            resolve(result[0].Prefix);
        });
    }).catch(err => console.error(err));
});

module.exports.setCommandChannel = (guild) => new Promise((resolve, reject) => {
    containsGuild(guild).then(boolean => {
        if (!boolean) return;
        const select = `SELECT CommandChannel FROM GuildSettings WHERE GuildId = ?;`;
        connection.query(select, [guild.id], (err, result) => {
            commandChannels.set(guild.id, result[0].CommandChannel ? result[0].CommandChannel : 'ALL');
            resolve(result[0].CommandChannel);
        });
    }).catch(err => console.error(err));
});

module.exports.getPrefix = (guildId) => {
    return prefixes.get(guildId) ? prefixes.get(guildId) : '-';
};

module.exports.getCommandChannel = (guildId) => {
    return commandChannels.get(guildId);
};