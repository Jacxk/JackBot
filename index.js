const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
//const tokenConfig = require('./tokenConfig.json');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const prefixUtil = require('./utilities/prefixUtil.js');

let file = fs.readFileSync("./data.json", "utf8");
let userData = JSON.parse(file);

let cooldownArray = [];

bot.on('ready', () => {
    prefixUtil.createTable();
    bot.guilds.forEach(guild => prefixUtil.setPrefix(guild).catch(err => console.error(err)));
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
        bot.commands.set(props.command.name, props);
    });
});

bot.on('channelCreate', channel => {
    if (channel.type === 'dm') return;
    let props = require('./utilities/muteUtils');
    let role = channel.guild.roles.find("name", "Muted");
    props.createMutedRole(channel.guild, channel, role, false);
});

bot.on('message', message => {
    if (message.author.bot) return;
    const prefix = prefixUtil.getPrefix(message.guild.id);
    if (!message.content.startsWith(prefix) && message.channel.type !== "dm") return rankSystem(message.author.id);

    let member = message.member;
    let args = message.content.substring(prefix.length).split(' ');

    let command = bot.commands.get(args[0].toLowerCase());
    if (command) command.run(message, args, bot);

    switch (args[0].toLowerCase()) {
        case 'rankup':
            if (!member.hasPermission("ADMINISTRATOR")) return noPermString(message);
            rankUpUser(message, args[2], args);
            break;
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

function noPermString(message) {
    let embed = new Discord.RichEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor("RED");
    message.channel.send(embed).then(m => m.delete(1000 * 10));
    message.react('❌').catch(err => embed.setColor("RED").setTitle('❌ ERROR ❌').setDescription(err));
    message.delete(1000 * 10);
}

function rankUpUser(message, roleName, args) {
    message.delete();
    let embed = new Discord.RichEmbed();
    if (args.length < 3) return message.channel.send(embed.setDescription(`Usage: ${prefix}rankUp [@user] [roleName]`).setColor("AQUA")).then(msg => msg.delete(5000));

    let user = message.mentions.members.first();
    let role = message.member.guild.roles.find("name", roleName.split('_').join(' '));

    if (!role) return message.channel.send(embed.setDescription("That role does not exist. Please try again...").setColor("AQUA")).then(msg => msg.delete(3000));

    message.channel.send(embed.setColor("AQUA").setDescription(`Everybody welcome ${user} to ${role}. Congratulations on your rankUp.`)).then(user.addRole(role.id));

}

//bot.login(tokenConfig.token).catch(err => console.log(err));
bot.login(process.env.botToken).catch(err => console.log(err));
