const Discord = require('discord.js');
const config = require('../config.json');
const prefix = config.prefix;

module.exports.run = (message, args) => {
    helpMessages(message, args);
};

function helpMessages(message, args) {
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
                        + `\n**Usage:** *${prefix}profile*`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'mute':
                embed
                    .setTitle('Mute Command')
                    .setDescription('You can mute/un-mute an user if he is not behaving.\n'
                        + '\n*Tip: You can also write the name of a user after the command to check his/her profile.*\n'
                        + '\n**Permission Needed:** *Manage Messages*'
                        + `\n**Usage:** *${prefix}mute [@user] [reason(optional)]*`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'rank':
                embed
                    .setTitle('Rank Command')
                    .setDescription('This command shows your current rank and level on the guild. '
                        + 'To gain XP you only need to chat.'
                        + '\n**Permission Needed:** *None*'
                        + '\nNOTE: You only gain XP every 1 minute to avoid the spam of messages.\n'
                        + `\n**Usage:** *${prefix}rank*`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'clear':
                embed
                    .setTitle('Clear Command')
                    .setDescription('This command is used to delete messages from the guild. '
                        + 'Only admins have access to this command.\n'
                        + '\n**Permission Needed:** *Administrator*'
                        + `\n**Usage:** *${prefix}clear [number]*`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'say':
                embed
                    .setTitle('Say Command')
                    .setDescription('This command lets you display a message as an embed message, just like this message.'
                        + '\n\n**Placeholders:** *--title:[Message_With_Space]* :heavy_minus_sign:  *--color:[COLOR]*'
                        + '\n**Permission Needed:** *Administrator*'
                        + `\n**Usage:** *${prefix}say [text (placeholders)]*`).setColor("AQUA");
                message.author.send(embed);
                break;
            case '8ball':
                embed
                    .setTitle('8ball Command')
                    .setDescription('Do you wanna know your future? Then ask to the ball.\n'
                        + '\n**Permission Needed:** *None*'
                        + `\n**Usage:** *${prefix}8ball [question]*`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'addemote':
                embed
                    .setTitle('addEmote Command')
                    .setDescription('If you wanna add a new emote to your guild without navigating through the setting use this command.\n'
                        + '\n**Permission Needed:** *Administrator*'
                        + `\n**Usage:** *${prefix}addEmote [image irl] [name]*`).setColor("AQUA");
                message.author.send(embed);
                break;
            case 'delemote':
                embed
                    .setTitle('delEmote Command')
                    .setDescription('If you wanna remove an existing custom emote from your guild without navigating through the setting use this command.\n'
                        + '\n**Permission Needed:** *Administrator*'
                        + `\n**Usage:** *${prefix}delEmote [name]*`).setColor("AQUA");
                message.author.send(embed);
                break;
            default:
                embed.setDescription(':x: **Could not find the specify command please try again** :x:').setColor("AQUA");
                message.author.send(embed);
        }
        return;
    }
    embed.setTitle('These are all the available commands')
        .setDescription('Use ' + prefix + 'help [commandName] to get more information about the command')
        .addField('Moderation Commands', moderation(), true)
        .addField('Admin Commands', admins(), true)
        .addField('Stats Commands', stats(), true)
        .addField('Misc Commands', misc(), true)
        .setColor("AQUA");
    message.author.send(embed);
}

const moderation = () => {
    const commands = ['mute', 'unMute', 'tempMute', 'clear'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

const misc = () => {
    const commands = ['8ball', 'meme', 'define', 'weather', 'profile', 'guildInfo',  'botInfo', 'translate'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

const admins = () => {
    const commands = ['addEmote', 'delEmote', 'say'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};


const stats = () => {
    const commands = ['hypixel', 'fortnite'];
    let stringCmd = [];
    for (let i = 0; i < commands.length; i++)
        stringCmd.push(prefix + commands[i]);
    return stringCmd.join('\n');
};

module.exports.command = {
    name: 'help'
};