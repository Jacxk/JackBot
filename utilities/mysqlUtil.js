const Discord = require('discord.js');
const mysql = require('mysql');
const messageUtil = require('../utilities/messageUtil.js');
//const sqlConfig = require('../mysqlConfig');
const prefixes = module.exports.prefixeMap = new Map();
const commandChannels = module.exports.commandChannelMap = new Map();
const joinLeaveChannels = module.exports.joinLeaveChannels = new Map();
const themeCollection = module.exports.themeCollection = new Map();

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
        'GuildName text, Prefix text, CommandChannel text, IncidentsChannel text, JoinLeaveChannel text, MemesChannel text, PRIMARY KEY (ID));';
    connection.query(statement, (err, result) => {
        if (err) return console.error(err);
    });
};

const containsGuild = (guild) => new Promise((resolve, reject) => {
    const select = `SELECT * FROM GuildSettings WHERE GuildId = ?;`;
    connection.query(select, [guild], (err, result) => {
        if (err) resolve(false);
        else resolve(!!result[0]);
    });
});

module.exports.getJoinLeaveChannel = (guildID) => {
    containsGuild(guildID).then(boolean => {
        if (!boolean) return;
        const select = `SELECT JoinLeaveChannel FROM GuildSettings WHERE GuildId = ?;`;

        connection.query(select, [guildID], (err, result) => {
            if (err) return console.error(err);
            joinLeaveChannels.set(guildID, result[0].JoinLeaveChannel)
        });
    }).catch(err => console.error(err));
};

module.exports.setJoinLeaveChannel = (channel, guild, channelID) => {
    const embed = new Discord.RichEmbed();
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const update = `UPDATE GuildSettings SET JoinLeaveChannel = ?, GuildName = ? WHERE GuildId = ?;`;

        connection.query(update, [channelID, guild.name, guild.id], (err, result) => {
            if (err) return console.error(err);
            joinLeaveChannels.set(guild.id, channelID);
            channel.send(embed.setColor("GOLD").setTitle('JoinLeave Channel Changed')
                .setDescription('You have successfully changed the joinLeave channel to ' + channel.guild.channels.get(channelID)))
                .then(msg => msg.delete(20 * 1000));
        });
    }).catch(err => console.error(err));
};

module.exports.setIncidentsChannel = (channel, guild, channelID) => {
    const embed = new Discord.RichEmbed();
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const update = `UPDATE GuildSettings SET IncidentsChannel = ?, GuildName = ? WHERE GuildId = ?;`;

        connection.query(update, [channelID, guild.name, guild.id], (err, result) => {
            if (err) return console.error(err);
            joinLeaveChannels.set(guild.id, channelID);
            channel.send(embed.setColor("GOLD").setTitle('Incidents Channel Changed')
                .setDescription('You have successfully changed the Incidents channel to ' + channel.guild.channels.get(channelID)))
                .then(msg => msg.delete(20 * 1000));
        });
    }).catch(err => console.error(err));
};

module.exports.getIncidentsChannel = (guildID) => {
    containsGuild(guildID).then(boolean => {
        if (!boolean) return;
        const select = `SELECT IncidentsChannel FROM GuildSettings WHERE GuildId = ?;`;

        connection.query(select, [guildID], (err, result) => {
            if (err) return console.error(err);
            joinLeaveChannels.set(guildID, result[0].IncidentsChannel)
        });
    }).catch(err => console.error(err));
};

module.exports.changePrefix = (channel, guild, prefix) => {
    const embed = new Discord.RichEmbed();
    const update = `UPDATE GuildSettings SET Prefix = ?, GuildName = ? WHERE GuildId = ?;`;
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;

        connection.query(update, [prefix, guild.name, guild.id], (err, result) => {
            console.log('Updating prefix of ' + guild.id);
            if (err) return messageUtil.sendError(channel, 'Update Error: ' + err.toString());
            prefixes.set(guild.id, prefix);
            channel.send(embed.setColor("GOLD").setTitle('Prefix Changed')
                .setDescription('You have successfully changed the prefix to `' + prefix + '`'))
                .then(msg => msg.delete(20 * 1000));
        });
    }).catch(err => messageUtil.sendError(channel, err.toString()));
};

module.exports.changeCommandChannel = (channel, guild, ch) => {
    const embed = new Discord.RichEmbed();
    const update = `UPDATE GuildSettings SET CommandChannel = ?, GuildName = ? WHERE GuildId = ?;`;

    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        connection.query(update, [ch.id ? ch.id : ch, guild.name, guild.id], (err, result) => {
            console.log('Updating CommandChannel of ' + guild.id);
            if (err) return messageUtil.sendError(channel, 'Update Error: ' + err.toString());
            commandChannels.set(guild.id, ch.id ? ch.id : ch);
            channel.send(embed.setColor("GOLD").setTitle('CommandChannel Changed').setDescription('You have successfully' +
                ' changed the CommandChannel to ' + ch)).then(msg => msg.delete(20 * 1000));
        });
    }).catch(err => messageUtil.sendError(channel, err.toString()));
};

module.exports.setPrefix = (guild) => {
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const select = `SELECT Prefix FROM GuildSettings WHERE GuildId = ?;`;
        connection.query(select, [guild.id], (err, result) => {
            prefixes.set(guild.id, result[0].Prefix);
        });
    }).catch(err => console.error(err));
};

module.exports.setCommandChannel = (guild) => {
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const select = `SELECT CommandChannel FROM GuildSettings WHERE GuildId = ?;`;
        connection.query(select, [guild.id], (err, result) => {
            commandChannels.set(guild.id, result[0].CommandChannel ? result[0].CommandChannel : 'ALL');
        });
    }).catch(err => console.error(err));
};

module.exports.getJoinThemeSQL = (guild) => {
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const select = `SELECT JoinTheme FROM GuildSettings WHERE GuildId = ?;`;
        connection.query(select, [guild.id], (err, result) => {
            themeCollection.set(guild.id, result[0].JoinTheme ? result[0].JoinTheme : 'default');
        });
    }).catch(err => console.error(err));
};

module.exports.setJoinTheme = (channel, guild, theme) => {
    const embed = new Discord.RichEmbed();
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const update = `UPDATE GuildSettings SET JoinTheme = ?, GuildName = ? WHERE GuildId = ?;`;

        connection.query(update, [theme, guild.name, guild.id], (err, result) => {
            if (err) return console.error(err);
            joinLeaveChannels.set(guild.id, theme);
            channel.send(embed.setColor("GOLD").setTitle('JoinLeave Theme Changed')
                .setDescription('You have successfully changed the JoinLeave theme to ' + theme))
                .then(msg => msg.delete(20 * 1000));
        });
    }).catch(err => console.error(err));
};

module.exports.getPrefix = (guildId) => {
    return prefixes.get(guildId) ? prefixes.get(guildId) : '-';
};

module.exports.getCommandChannel = (guildId) => {
    return commandChannels.get(guildId);
};

module.exports.getJoinTheme = (guildId) => {
    return themeCollection.get(guildId) ? themeCollection.get(guildId) : 'default';
};
