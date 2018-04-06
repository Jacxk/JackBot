const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
//const tokenConfig = require('./tokenConfig.json');
const bot = new Discord.Client();
const messageUtil = require('./utilities/messageUtil.js');
const commandsCollection = new Discord.Collection();
const mysqlUtil = require('./utilities/mysqlUtil.js');
const website = require('./website.js');

let file = fs.readFileSync("./data.json", "utf8");
let userData = JSON.parse(file);

let cooldownArray = [];

website.runWebsite();
bot.on('ready', () => {
    mysqlUtil.connect();
    bot.guilds.forEach(guild => {
        mysqlUtil.setPrefix(guild).catch(err => console.error(err));
        mysqlUtil.setCommandChannel(guild).catch(err => console.error(err));
    });
    setGameStatus();
    console.log('bot ready');
    bot.user.setStatus("dnd").catch(console.error);
});


function setGameStatus() {
    setInterval(() => {
        let gameStatus = config.games;
        let game = gameStatus[Math.floor(Math.random() * gameStatus.length)];
        bot.user.setActivity(game.replace('%randomUser%', bot.users.random().username), {type: "WATCHING"}).catch(err => console.log(err));
        console.log('game changed to ' + game);
    }, 60 * 60000);
}

fs.readdir("./commands/", (error, files) => {
    if (error) return console.log(error);

    let commands = files.filter(file => file.split(".").pop() === 'js');

    commands.forEach((commandFile) => {
        let props = require(`./commands/${commandFile}`);
        commandsCollection.set(props.command.name, props);
        if (props.command.aliases) props.command.aliases.forEach(alias => commandsCollection.set(alias, props));
    });
});

bot.on('channelCreate', channel => {
    if (channel.type === 'dm') return;
    let muteUtils = require('./utilities/muteUtils');
    let role = channel.guild.roles.find("name", "Muted");
    muteUtils.createMutedRole(channel.guild, channel, role, false);
});

bot.on('message', message => {
    if (message.author.bot) return;

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
        if (message.author.id !== "266315409735548928" && !command.command.enabled)
            return messageUtil.commandDisabled(message);
        if (message.author.id !== "266315409735548928" && command.command.permission !== 'none' && !message.member.hasPermission(command.command.permission))
            return messageUtil.noPermissionMessage(message);
        command.run(message, args, commandsCollection, bot);
    }

});

function rankSystem(id) {
    if (cooldownArray.indexOf(id) > -1) return;
    else {
        cooldownArray.push(id);
        setTimeout(function () {
            cooldownArray.splice(cooldownArray.indexOf(id), 1);
        }, 1000 * 60);
    }
    if (!userData[id]) userData[id] = {
        level: 1,
        exp: 0
    };

    giveExp(Math.floor(Math.random() * 15 + 10), id);

    fs.writeFile('./data.json', JSON.stringify(userData, null, 2), (err) => {
        if (err) console.log(err)
    });
}

function giveExp(exp, id) {

    userData[id].exp += exp;

    if (getNeededExp(id) <= 0) {
        userData[id].level++;
    }
    console.log(getNeededExp(id) + '/' + getTotalExpForLevel(userData[id].level));
}

function getExpString(id) {
    let embed = new Discord.RichEmbed();

    let nextLevelTotal = getTotalExpForLevel(userData[id].level);


    return embed.setDescription(getNeededExp(id) + '/' + nextLevelTotal + '\nTotal Exp: ' + userData[id].exp + '\nCurrent level: ' + userData[id].level).setColor("AQUA");
}

function getNeededExp(id) {
    return getTotalExpForLevel(userData[id].level) - (userData[id].exp - getTotalExpForLevel(userData[id].level - 1));
}

function getTotalExpForLevel(level) {
    return Math.floor(450 * (level * 1.35));
}

//bot.login(tokenConfig.token).catch(err => console.log(err));
bot.login(process.env.botToken).catch(err => console.log(err));
