const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const messageUtil = require('./utilities/messageUtil.js');
const mysqlUtil = require('./utilities/mysqlUtil.js');
const website = require('./website.js');

const bot = new Discord.Client();
const commandsCollection = new Discord.Collection();
const joinLeaveThemes = module.exports.joinLeaveThemes = new Discord.Collection();
let commandSize = 0;

website.runWebsite(bot);

bot.login(config.botToken).catch(err => console.log(err));

bot.on('ready', () => {
    bot.guilds.forEach(guild => {
        mysqlUtil.createGuild(guild);
        mysqlUtil.setPrefix(guild);
        mysqlUtil.setCommandChannel(guild);
        mysqlUtil.getJoinLeaveChannel(guild.id);
        mysqlUtil.getJoinThemeSQL(guild);
        mysqlUtil.getIncidentsChannel(guild.id);
    });
    setGame();
    getBotStats();
    console.log(`${bot.user.username} is ready in ${bot.guilds.size} guilds and ${bot.users.size} members!`);
});

bot.on('disconnect', () => getBotStats('Offline'));
bot.on('guildCreate', () => getBotStats());
bot.on('guildDelete', () => getBotStats());

fs.readdir('./utilities/joinLeaveThemes/', (err, files) => {
    if (err) return console.log(err);

    let themes = files.filter(file => file.split(".").pop() === 'js');

    themes.forEach((theme) => {
        let props = require(`./utilities/joinLeaveThemes/${theme}`);
        joinLeaveThemes.set(theme.split(".")[0], props);
    });
});

loadCommands();

function loadCommands(dir = "./commands/") {
    fs.readdir(dir, (error, files) => {
        if (error) return console.log(error);

        files.forEach((file) => {
            if (fs.lstatSync(dir + file).isDirectory()) {
                loadCommands(dir + file + "/");
                return;
            }

            commandSize++;
            let props = require(`${dir}${file}`);
            commandsCollection.set(props.command.name, props);
            if (props.command.aliases) props.command.aliases.forEach(alias => {
                if (commandsCollection.get(alias)) return console.log(`Conflict with alias: ${alias}`);
                commandsCollection.set(alias, props)
            });
        });
    });
}

bot.on('guildMemberAdd', member => {
    const channelId = mysqlUtil.joinLeaveChannels.get(member.guild.id);
    const channel = member.guild.channels.get(channelId);
    if (!channel) return;
    joinLeaveThemes.get(mysqlUtil.getJoinTheme(member.guild.id)).join(member, channel);

    getBotStats();
});

bot.on('guildMemberRemove', member => {
    const channelId = mysqlUtil.joinLeaveChannels.get(member.guild.id);
    const channel = member.guild.channels.get(channelId);
    if (!channel) return;
    joinLeaveThemes.get(mysqlUtil.getJoinTheme(member.guild.id)).leave(member, channel);

    getBotStats();
});

bot.on('channelCreate', channel => {
    if (channel.type === 'dm') return;
    let muteUtils = require('./utilities/muteUtils');
    let role = channel.guild.roles.find("name", "Muted");
    muteUtils.createMutedRole(channel.guild, channel, role, false);
});

bot.on('guildCreate', guild => {
    mysqlUtil.createGuild(guild);
});

bot.on('guildDelete', guild => {
    mysqlUtil.deleteGuild(guild);
});

bot.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    const prefix = message.channel.type !== "dm" ? mysqlUtil.getPrefix(message.guild.id) : '-';
    let commandChannel = message.channel.type !== "dm" ? mysqlUtil.getCommandChannel(message.guild.id) : "ALL";

    if (!message.content.startsWith(prefix) && message.channel.type !== "dm") return; //rankSystem(message.author.id);
    if (commandChannel !== 'ALL' && commandChannel !== undefined) {
        const channel = message.guild.channels.get(commandChannel);
        if (message.channel.id !== channel.id && !message.member.hasPermission("ADMINISTRATOR"))
            return messageUtil.sendError(message.channel, `You can only use this command in ${channel}`)
    }

    const args = message.content.substring(prefix.length).split(' ');

    const command = commandsCollection.get(args[0].toLowerCase());
    if (command) {
        if (message.author.id !== "266315409735548928" && !command.command.enabled) return messageUtil.commandDisabled(message);
        if (message.author.id !== "266315409735548928" && command.command.permission !== 'none' && !message.member.hasPermission(command.command.permission))
            return messageUtil.noPermissionMessage(message);
        command.run(message, args, commandsCollection, bot);
    }

});

function setGame() {
    const set = () => {
        let gameStatus = config.games;
        let game = gameStatus[Math.floor(Math.random() * gameStatus.length)];
        //bot.user.setActivity(game.replace('%randomUser%', bot.users.random().username), {type: "WATCHING"}).catch(err => console.log(err));
        bot.user.setActivity("http://www.jackbot.pw/", {type: "WATCHING"}).catch(err => console.log(err));
    };
    set();
    setInterval(() => set(), 60 * 60000);
    bot.user.setStatus("dnd").catch(console.error);
}

function getBotStats(status) {
    const stats = {
        guilds: bot.guilds.size,
        users: bot.users.filter(f => !f.bot).size,
        commands: commandSize,
        status: !status ? 'Online' : status
    };

    fs.writeFile('./botstats.json', JSON.stringify(stats, null, 2), null, err => {
        if (err) console.log(err)
    });
}

function closeApp() {
    console.log("Closing App");
    getBotStats('Offline');

    setTimeout(() => process.exit(), 2 * 1000);
}

process.on('SIGINT', () => {
    closeApp();
});

process.on('SIGHUP', () => {
    closeApp();
});

process.on('SIGTERM', () => {
    closeApp();
});