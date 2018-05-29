const Discord = require('discord.js');
const mysqlUtil = require('../../utilities/mysqlUtil.js');

module.exports.run = (message, args, commandsCollection) => {
    helpMessages(message, args, commandsCollection);
};

function helpMessages(message, args, commandsCollection) {
    const prefix = message.channel.type !== "dm" ? mysqlUtil.getPrefix(message.guild.id) : '-';
    let embed = new Discord.RichEmbed();
    let channel = message.channel;
    if (channel.type !== "dm") channel.send(embed.setDescription('✅ Sending help... Check your PM ✅').setColor('GREEN'));
    if (args.length === 2) {
        const command = args[1].toLowerCase();
        switch (command) {
            case 'profile':
                embed
                    .setTitle('Profile Command')
                    .setDescription('This command shows your profile from the current guild.\n'
                        + '\n*Tip: You can also write the name of a user after the command to check his/her profile.*\n'
                        + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                        + `\n**Usage:** *${prefix}profile*`
                        + `\n**Aliases**: ${aliases('profile', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'mute':
                embed.setTitle('Mute Command').setDescription('You can mute/un-mute an user if he is not behaving.\n'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}mute [@user] [reason]*`
                    + `\n**Aliases**: ${aliases('mute', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'unmute':
                embed.setTitle('UnMute Command').setDescription('You can un-mute an user that was muted for some reason.\n'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}unMute [@user]*`
                    + `\n**Aliases**: ${aliases('unmute', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'tempmute':
                embed.setTitle('TempMute Command').setDescription('You can mute a user if he is not behaving for an specific period of time.\n'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}tempMute [time S|M|H] [@user] [reason]*`
                    + `\n**Aliases**: ${aliases('tempmute', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'rank':
                embed.setTitle('Rank Command').setDescription('This command shows your current rank and level on the guild. '
                    + 'To gain XP you only need to chat.'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + '\nNOTE: You only gain XP every 1 minute to avoid the spam of messages.\n'
                    + `\n**Usage:** *${prefix}rank*`
                    + `\n**Aliases**: ${aliases('rank', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'clear':
                embed.setTitle('Clear Command').setDescription('This command is used to delete messages from the guild. '
                    + 'Only admins have access to this command.\n'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}clear [number]*`
                    + `\n**Aliases**: ${aliases('clear', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'say':
                embed.setTitle('Say Command').setDescription('This command lets you display a message as an embed message, just like this message.'
                    + '\n\n**Placeholders:** *--title:[Message_With_Space]* **|** *--color:[COLOR]* **|** \n*--channel:[#CHANNEL]* **|** *--newLine*'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}say [text (placeholders)]*`
                    + `\n**Aliases**: ${aliases('say', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case '8ball':
                embed.setTitle('8ball Command').setDescription('Do you wanna know your future? Then ask to the ball.\n'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}8ball [question]*`
                    + `\n**Aliases**: ${aliases('8ball', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'addemote':
                embed.setTitle('addEmote Command').setDescription('If you wanna add a new emote to your guild without navigating through the setting use this command.\n'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}addEmote [image irl] [name]*`
                    + `\n**Aliases**: ${aliases('addemote', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'delemote':
                embed.setTitle('delEmote Command').setDescription('If you wanna remove an existing custom emote from '
                    + 'your guild without navigating through the setting use this command.\n'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}delEmote [name]*`
                    + `\n**Aliases**: ${aliases('delemote', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'define':
                embed.setTitle('Define Command').setDescription('Define a word that you don\'t know. Using Urban Dictionary.'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}define [word] (page number)*`
                    + `\n**Aliases**: ${aliases('define', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'weather':
                embed.setTitle('Weather Command').setDescription('Check the weather from the specified city.'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}weather [city]*`
                    + `\n**Aliases**: ${aliases('weather', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'translate':
                embed.setTitle('Translate Command').setDescription('Translate some text to a desire language.'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}translate [lang] [text]*`
                    + `\n**Aliases**: ${aliases('translate', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'guildinfo':
                embed.setTitle('GuildInfo Command').setDescription('Check some information about the guild'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}guildInfo*`
                    + `\n**Aliases**: ${aliases('guildinfo', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'botinfo':
                embed.setTitle('BotInfo Command').setDescription('Check some information about the bot'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}botInfo*`
                    + `\n**Aliases**: ${aliases('botinfo', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'setprefix':
                embed.setTitle('SetPrefix Command').setDescription('Set the prefix of the commands from the bot'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}botInfo*`
                    + `\n**Aliases**: ${aliases('setprefix', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'hypixel':
                embed.setTitle('Hypixel Command').setDescription('Check the statistics of kills, wins, etc. of your '
                    + 'friend or yourself from hypixel'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}hypixel [playerName] [gameMode]*`
                    + `\n**Aliases**: ${aliases('hypixel', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'fortnite':
                embed.setTitle('Fortnite Command').setDescription('Check the statistics of kills, wins, etc. of your '
                    + 'friend or yourself from fortnite'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}fortnite [platform] [username] (gameMode)*`
                    + `\n**Aliases**: ${aliases('fortnite', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'warn':
                embed.setTitle('Warn Command').setDescription('Warn a user for any reason you like'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}warn [@user] [message]*`
                    + `\n**Aliases**: ${aliases('warn', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'invite':
                embed.setTitle('Invite Command').setDescription('Get an invite link to get me on you server'
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${prefix}invite*`
                    + `\n**Aliases**: ${aliases('invite', commandsCollection)}`).setColor("AQUA");
                message.author.send(embed);
                break;
            default:
                embed.setDescription(':x: Could not find the specify command please try again :x:').setColor("AQUA");
                message.author.send(embed);
        }
        return;
    }
    embed.setTitle('These are all the available commands')
        .setDescription(`Use ${prefix}help [commandName] to get more information about the command`)
        .addField('Moderation Commands', moderation(prefix), true)
        .addField('Admin Commands', admins(prefix), true)
        .addField('Stats Commands', stats(prefix), true)
        .addField('Misc Commands', misc(prefix), true)
        .addField('Music Commands', music(prefix), true)
        .setColor("AQUA");
    message.author.send(embed);
}

const moderation = (prefix) => {
    const commands = ['mute', 'unMute', 'tempMute', 'clear', 'warn', 'ban', 'unBan', 'tempBan', 'kick'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

const misc = (prefix) => {
    const commands = ['8ball', 'meme', 'define', 'weather', 'profile', 'guildInfo', 'botInfo', 'translate', 'changeLog', 'invite'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

const admins = (prefix) => {
    const commands = ['addEmote', 'delEmote', 'say', 'setPrefix', 'setPrefix', 'setup', 'rankUp'];
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

const music = (prefix) => {
    const commands = ['play', 'skip', 'volume', 'currentsong', 'queue'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

const aliases = (command, commandsCollection) => {
    const file = commandsCollection.get(command);
    if (file.command.aliases === undefined) {
        return 'None';
    } else return file.command.aliases.join(', ').trim();
};

const getPermission = (commandsCollection, command) => {
    return commandsCollection.get(command).command.permission;
};

module.exports.command = {
    name: 'help',
    permission: "none",
    description: "Get help about all the commands.",
    enabled: true
};