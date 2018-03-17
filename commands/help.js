const Discord = require('discord.js');
const prefixUtil = require('../utilities/prefixUtil.js');
const fs = require('fs');

module.exports.run = (message, args) => {
    helpMessages(message, args);
};

function helpMessages(message, args) {
    const prefix = message.channel.type !== "dm" ? prefixUtil.getPrefix(message.guild.id) : '-';
    let embed = new Discord.RichEmbed();
    let channel = message.channel;
    if (channel.type !== "dm") channel.send(embed.setDescription('✅ Sending help... Check your PM ✅').setColor('GREEN'));
    if (args.length === 2) {
        switch (args[1].toLowerCase()) {
            case 'profile':
                embed
                    .setTitle('Profile Command')
                    .setDescription('This command shows your profile from the current guild.\n'
                        + '\n*Tip: You can also write the name of a user after the command to check his/her profile.*\n'
                        + '\n**Permission Needed:** *None*'
                        + `\n**Usage:** *${prefix}profile*`
                        + `\n**Aliases**: ${aliases('profile')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'mute':
                embed.setTitle('Mute Command').setDescription('You can mute/un-mute an user if he is not behaving.\n'
                    + '\n**Permission Needed:** *Manage Messages*'
                    + `\n**Usage:** *${prefix}mute [@user] [reason]*`
                    + `\n**Aliases**: ${aliases('mute')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'unmute':
                embed.setTitle('UnMute Command').setDescription('You can un-mute an user that was muted for some reason.\n'
                    + '\n**Permission Needed:** *Manage Messages*'
                    + `\n**Usage:** *${prefix}unMute [@user]*`
                    + `\n**Aliases**: ${aliases('unmute')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'tempmute':
                embed.setTitle('TempMute Command').setDescription('You can mute a user if he is not behaving for an specific period of time.\n'
                    + '\n**Permission Needed:** *Manage Messages*'
                    + `\n**Usage:** *${prefix}tempMute [time S|M|H] [@user] [reason]*`
                    + `\n**Aliases**: ${aliases('tempmute')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'rank':
                embed.setTitle('Rank Command').setDescription('This command shows your current rank and level on the guild. '
                    + 'To gain XP you only need to chat.'
                    + '\n**Permission Needed:** *None*'
                    + '\nNOTE: You only gain XP every 1 minute to avoid the spam of messages.\n'
                    + `\n**Usage:** *${prefix}rank*`
                    + `\n**Aliases**: ${aliases('rank')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'clear':
                embed.setTitle('Clear Command').setDescription('This command is used to delete messages from the guild. '
                    + 'Only admins have access to this command.\n'
                    + '\n**Permission Needed:** *Administrator*'
                    + `\n**Usage:** *${prefix}clear [number]*`
                    + `\n**Aliases**: ${aliases('clear')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'say':
                embed.setTitle('Say Command').setDescription('This command lets you display a message as an embed message, just like this message.'
                    + '\n\n**Placeholders:** *--title:[Message_With_Space]* :heavy_minus_sign:  *--color:[COLOR]*'
                    + '\n**Permission Needed:** *Administrator*'
                    + `\n**Usage:** *${prefix}say [text (placeholders)]*`
                    + `\n**Aliases**: ${aliases('say')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case '8ball':
                embed.setTitle('8ball Command').setDescription('Do you wanna know your future? Then ask to the ball.\n'
                    + '\n**Permission Needed:** *None*'
                    + `\n**Usage:** *${prefix}8ball [question]*`
                    + `\n**Aliases**: ${aliases('8ball')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'addemote':
                embed.setTitle('addEmote Command').setDescription('If you wanna add a new emote to your guild without navigating through the setting use this command.\n'
                    + '\n**Permission Needed:** *Administrator*'
                    + `\n**Usage:** *${prefix}addEmote [image irl] [name]*`
                    + `\n**Aliases**: ${aliases('addemote')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'delemote':
                embed.setTitle('delEmote Command').setDescription('If you wanna remove an existing custom emote from '
                    + 'your guild without navigating through the setting use this command.\n'
                    + '\n**Permission Needed:** *Administrator*'
                    + `\n**Usage:** *${prefix}delEmote [name]*`
                    + `\n**Aliases**: ${aliases('delemote')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'define':
                embed.setTitle('Define Command').setDescription('Define a word that you don\'t know. Using Urban Dictionary.'
                    + '\n**Permission Needed:** *None*'
                    + `\n**Usage:** *${prefix}define [word] (page number)*`
                    + `\n**Aliases**: ${aliases('define')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'weather':
                embed.setTitle('Weather Command').setDescription('Check the weather from the specified city.'
                    + '\n**Permission Needed:** *None*'
                    + `\n**Usage:** *${prefix}weather [city]*`
                    + `\n**Aliases**: ${aliases('weather')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'translate':
                embed.setTitle('Translate Command').setDescription('Translate some text to a desire language.'
                    + '\n**Permission Needed:** *None*'
                    + `\n**Usage:** *${prefix}translate [lang] [text]*`
                    + `\n**Aliases**: ${aliases('translate')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'guildinfo':
                embed.setTitle('GuildInfo Command').setDescription('Check some information about the guild'
                    + '\n**Permission Needed:** *None*'
                    + `\n**Usage:** *${prefix}guildInfo*`
                    + `\n**Aliases**: ${aliases('guildinfo')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'botinfo':
                embed.setTitle('BotInfo Command').setDescription('Check some information about the bot'
                    + '\n**Permission Needed:** *None*'
                    + `\n**Usage:** *${prefix}botInfo*`
                    + `\n**Aliases**: ${aliases('botinfo')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'setprefix':
                embed.setTitle('SetPrefix Command').setDescription('Set the prefix of the commands from the bot'
                    + '\n**Permission Needed:** *Administrator*'
                    + `\n**Usage:** *${prefix}botInfo*`
                    + `\n**Aliases**: ${aliases('setprefix')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'hypixel':
                embed.setTitle('Hypixel Command').setDescription('Check the statistics of kills, wins, etc. of your '
                    + 'friend or yourself from hypixel'
                    + '\n**Permission Needed:** *None*'
                    + `\n**Usage:** *${prefix}hypixel [playerName] [gameMode]*`
                    + `\n**Aliases**: ${aliases('hypixel')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'fortnite':
                embed.setTitle('Fortnite Command').setDescription('Check the statistics of kills, wins, etc. of your '
                    + 'friend or yourself from fortnite'
                    + '\n**Permission Needed:** *None*'
                    + `\n**Usage:** *${prefix}fortnite [platform] [username] (gameMode)*`
                    + `\n**Aliases**: ${aliases('fortnite')}`).setColor("AQUA");
                message.author.send(embed);
                break;
            default:
                embed.setDescription(':x: Could not find the specify command please try again :x:').setColor("AQUA");
                message.author.send(embed);
        }
        return;
    }
    embed.setTitle('These are all the available commands')
        .setDescription('Use -help [commandName] to get more information about the command')
        .addField('Moderation Commands', moderation(prefix), true)
        .addField('Admin Commands', admins(prefix), true)
        .addField('Stats Commands', stats(prefix), true)
        .addField('Misc Commands', misc(prefix), true)
        .setColor("AQUA");
    message.author.send(embed);
}

const moderation = (prefix) => {
    const commands = ['mute', 'unMute', 'tempMute', 'clear'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

const misc = (prefix) => {
    const commands = ['8ball', 'meme', 'define', 'weather', 'profile', 'guildInfo', 'botInfo', 'translate'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

const admins = (prefix) => {
    const commands = ['addEmote', 'delEmote', 'say', 'setPrefix'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};


const stats = (prefix) => {
    const commands = ['hypixel', 'fortnite'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

const aliases = (command) => {
    let aliases = [];
    fs.readdir("./commands/", (error, files) => {
        if (error) return console.log(error);

        let commands = files.filter(file => file.split(".").pop() === 'js');

        commands.forEach((commandFile) => {
            let file = require(`./${commandFile}`);
            if (command === file.command.name)
                if (file.command.aliases === undefined) {
                    return aliases.push('None');
                } else return file.command.aliases.forEach(key => aliases.push(key))
        });
    });
    return aliases.join(', ').trim();
};

module.exports.command = {
    name: 'help'
};