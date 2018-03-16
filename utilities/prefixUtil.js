const mysql = require('mysql');
const messageUtil = require('../utilities/messageUtil.js');
const prefixes = module.exports.prefixeMap = new Map();

module.exports.connect = (channel, guild, prefix) => {
    createTable(channel);
    insertPrefix(channel, guild, prefix);
};

const connection = mysql.createConnection({
    host: "144.217.208.190",
    user: "anlferm58550",
    database: "anlferm58550DB",
    password: "xaIdlXEZKnoh"
});

const createTable = module.exports.createTable = (channel) => {
    const statement = `CREATE TABLE IF NOT EXISTS GuildSettings (ID int NOT NULL AUTO_INCREMENT, GuildId long, GuildName text, Prefix text, PRIMARY KEY (ID));`;
    connection.query(statement, (err, result) => {
        if (err) return messageUtil.sendError(channel, err.toString());
    });
};

const insertPrefix = module.exports.insertPrefix = (channel, guild, prefix) => {
    const insertStatement = `INSERT INTO GuildSettings (GuildId, GuildName, Prefix) VALUES (?, ?, ?);`;
    const update = `UPDATE GuildSettings SET Prefix = ?, GuildName = ? WHERE GuildId = ?;`;
    containsGuild(guild).then(boolean => {
        if (!boolean) connection.query(insertStatement, [guild.id, guild.name, prefix], (err, result) => {
            console.log('Inserting prefix of ' + guild.id);
            if (err) return messageUtil.sendError(channel, 'Insert Error: ' + err.toString());
            prefixes.set(guild.id, prefix);
        });
        else connection.query(update, [prefix, guild.name, guild.id], (err, result) => {
            console.log('Updating prefix of ' + guild.id);
            if (err) return messageUtil.sendError(channel, 'Update Error: ' + err.toString());
            prefixes.set(guild.id, prefix);
        });
    }).catch(err => messageUtil.sendError(channel, err.toString()));
};

const containsGuild = (guild) => new Promise((resolve, reject) => {
    const select = `SELECT * FROM GuildSettings WHERE GuildId = ?;`;
    connection.query(select, [guild.id], (err, result) => {
        resolve(!!result[0]);
    });
});

module.exports.setPrefixChannel = (channel) => new Promise((resolve, reject) => {
    containsGuild(channel.guild).then(boolean => {
        if (!boolean) messageUtil.sendError(channel, 'Unexpected error occurred while getting the prefix');
        const select = `SELECT Prefix FROM GuildSettings WHERE GuildId = ?;`;
        connection.query(select, [channel.guild.id], (err, result) => {
            prefixes.set(channel.guild.id, result[0].Prefix);
            resolve(result[0].Prefix);
        });
    }).catch(err => messageUtil.sendError(channel, err.toString()));
});

module.exports.setPrefixGuild = (guild) => new Promise((resolve, reject) => {
    containsGuild(guild).then(boolean => {
        if (!boolean) return;
        const select = `SELECT Prefix FROM GuildSettings WHERE GuildId = ?;`;
        connection.query(select, [guild.id], (err, result) => {
            prefixes.set(guild.id, result[0].Prefix);
            resolve(result[0].Prefix);
        });
    }).catch(err => console.error(err));
});

module.exports.getPrefix = (guildId) => {
    return prefixes.get(guildId) ? prefixes.get(guildId) : '-';
};