const Discord = require('discord.js');
const mysqlUtil = require('../../utilities/mysqlUtil.js');
const commandsArray = ['mute', 'unMute', 'tempMute', 'clear', 'warn', 'ban', 'unBan', 'tempBan', 'kick',
    '8ball', 'meme', 'define', 'weather', 'profile', 'guildInfo', 'botInfo', 'translate', 'changeLog', 'invite', 'ping',
    'addEmote', 'delEmote', 'say', 'setPrefix', 'setup', 'rankUp', 'hypixel', 'fortnite', 'play', 'skip',
    'volume', 'currentsong', 'queue'];

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
        if (commandsArray.includes(command) && commandsCollection.get(command).command.enable) {
            embed.setTitle(`${command.charAt(0).toUpperCase() + command.slice(1)} Command`)
                .setDescription(`**Description:** ${getDescription(commandsCollection, command)}.\n`
                    + `\n**Permission Needed:** *${getPermission(commandsCollection, command)}*`
                    + `\n**Usage:** *${getUsage(commandsCollection, command, prefix)}*`
                    + `\n**Aliases**: ${aliases('profile', commandsCollection)}`).setColor("AQUA");
            return message.author.send(embed);
        }
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
    const commands = ['8ball', 'meme', 'define', 'weather', 'guildInfo', 'botInfo', 'translate', 'changeLog', 'invite', 'ping'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

const admins = (prefix) => {
    const commands = ['addEmote', 'delEmote', 'say', 'setPrefix', 'rankUp'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};


const stats = (prefix) => {
    const commands = ['hypixel', 'fortnite', 'profile'];
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

const getDescription = (commandsCollection, command) => {
    return commandsCollection.get(command).command.description;
};

const getUsage = (commandsCollection, command, prefix) => {
    return prefix + commandsCollection.get(command).command.usage;
};

module.exports.command = {
    name: 'help',
    permission: "none",
    description: "Get help about all the commands.",
    usage: "help",
    enabled: true
};