const Discord = require('discord.js');
const mysql = require('mysql');
const config = require('../config.json');
const messageUtil = require('../utilities/messageUtil.js');
const prefixes = module.exports.prefixeMap = new Map();
const commandChannels = module.exports.commandChannelMap = new Map();
const joinLeaveChannels = module.exports.joinLeaveChannels = new Map();
const incidentsChannels = module.exports.incidentsChannels = new Map();
const themeCollection = module.exports.themeCollection = new Map();

const connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    database: config.database.database,
    password: config.database.password
});

const containsGuild = (guild) => new Promise((resolve, reject) => {
    const select = `SELECT * FROM GuildSettings WHERE GuildId = ?;`;
    connection.query(select, [guild], (err, result) => {
        if (err) reject(err.toString());
        else resolve(!!result[0]);
    });
});

module.exports.createGuild = (guild) => {
    containsGuild(guild.id).then(boolean => {
        if (boolean) return;
        const select = 'INSERT INTO GuildSettings (GuildId,GuildName,Prefix,CommandChannel,IncidentsChannel,JoinLeaveChannel,' +
            'MemesChannel,JoinTheme) VALUES (?,?,?,?,?,?,?,?);';
        connection.query(select, [guild.id, guild.name, '-', 'ALL', 'None', 'None', 'None', 'default'], (err) => {
            if (err) return console.error(err);
        });
    });
};

module.exports.deleteGuild = (guild) => {
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const select = 'DELETE FROM GuildSettings WHERE GuildId = ?;';
        connection.query(select, [guild.id], (err) => {
            if (err) return console.error(err);
            prefixes.delete(guild.id);
            commandChannels.delete(guild.id);
            joinLeaveChannels.delete(guild.id);
            incidentsChannels.delete(guild.id);
            themeCollection.delete(guild.id);
        });
    });
};

module.exports.getJoinLeaveChannel = (guildID) => {
    containsGuild(guildID).then(boolean => {
        if (!boolean) return;
        const select = `SELECT JoinLeaveChannel FROM GuildSettings WHERE GuildId = ?;`;

        connection.query(select, [guildID], (err, result) => {
            if (err) return console.error(err);
            joinLeaveChannels.set(guildID, result[0]["JoinLeaveChannel"])
        });
    }).catch(err => console.error(err));
};

module.exports.setJoinLeaveChannel = (channel, guild, channelID) => {
    const embed = new Discord.RichEmbed();
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const update = `UPDATE GuildSettings SET JoinLeaveChannel = ?, GuildName = ? WHERE GuildId = ?;`;

        connection.query(update, [channelID, guild.name, guild.id], (err) => {
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

        connection.query(update, [channelID, guild.name, guild.id], (err,) => {
            if (err) return console.error(err);
            incidentsChannels.set(guild.id, channelID);
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
            incidentsChannels.set(guildID, result[0].IncidentsChannel)
        });
    }).catch(err => console.error(err));
};

module.exports.changePrefix = (channel, guild, prefix) => {
    const embed = new Discord.RichEmbed();
    const update = `UPDATE GuildSettings SET Prefix = ?, GuildName = ? WHERE GuildId = ?;`;
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;

        connection.query(update, [prefix, guild.name, guild.id], (err) => {
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
        connection.query(update, [ch.id ? ch.id : ch, guild.name, guild.id], (err) => {
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
            if (err) return console.error(err);

            prefixes.set(guild.id, result[0].Prefix);
        });
    }).catch(err => console.error(err));
};

module.exports.setCommandChannel = (guild) => {
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const select = `SELECT CommandChannel FROM GuildSettings WHERE GuildId = ?;`;
        connection.query(select, [guild.id], (err, result) => {
            if (err) return console.error(err);

            commandChannels.set(guild.id, result[0].CommandChannel ? result[0].CommandChannel : 'ALL');
        });
    }).catch(err => console.error(err));
};

module.exports.getJoinThemeSQL = (guild) => {
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const select = `SELECT JoinTheme FROM GuildSettings WHERE GuildId = ?;`;
        connection.query(select, [guild.id], (err, result) => {
            if (err) return console.error(err);
            themeCollection.set(guild.id, result[0].JoinTheme);
        });
    }).catch(err => console.error(err));
};

module.exports.setJoinTheme = (channel, guild, theme) => {
    const embed = new Discord.RichEmbed();
    containsGuild(guild.id).then(boolean => {
        if (!boolean) return;
        const update = `UPDATE GuildSettings SET JoinTheme = ?, GuildName = ? WHERE GuildId = ?;`;

        connection.query(update, [theme, guild.name, guild.id], (err) => {
            if (err) return console.error(err);

            themeCollection.set(guild.id, theme);
            channel.send(embed.setColor("GOLD").setTitle('JoinLeave Theme Changed')
                .setDescription(`You have successfully changed the JoinLeave theme to theme **${theme}**`)
                .setImage(`https://jackbot.pw/images/themes_examples/${theme}.jpg`))
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
    return themeCollection.has(guildId) ? themeCollection.get(guildId) : 'default';
};
