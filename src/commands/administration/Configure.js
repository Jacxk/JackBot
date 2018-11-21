const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');
const Database = require('../../database/Database.js');
const Discord = require('discord.js');

class Configure extends Command {
    constructor() {
        super('configure', ["config", "setup"]);
        this.setCategory('administration');
        this.setUsage('<prefix | music>');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const locale = client.getLocale(message.guild.id);
        
        if (args.length < 1) return MessageUtil.sendWrongUsage(channel, this.getUsage(), 'configure prefix >>');
        switch (args[0].toLowerCase()) {
            case "prefix": {
                if (args.length < 2) return MessageUtil.sendWrongUsage(channel, this.getUsage(), 'configure prefix >>');
                const embed = new Discord.RichEmbed().setColor("LUMINOUS_VIVID_PINK");
                embed.setDescription(Translation.getSuccess('configure.prefix_change', locale).replaceAll('{user}', message.author)
                    .replaceAll('{prefix}', `**${args[1]}**`));
                Database.Prefix.setPrefix(message.guild.id, args[1], message.author.id);
                channel.send(embed);
                break;
            }
            case "music": {
                if (args.length < 2) return MessageUtil.sendWrongUsage(channel, this.getUsage(), 'configure music queue_limit 10');
                const embed = new Discord.RichEmbed().setTitle('Changed Music Settings').setColor("LUMINOUS_VIVID_PINK");
                switch (args[1].toLowerCase()) {
                    case "queue_limit": {
                        if (args.length < 3) return MessageUtil.sendWrongUsage(channel, this.getUsage(), 'configure music queue_limit 10');

                        if (isNaN(parseInt(args[2]))) return MessageUtil.sendError(Translation.getError('invalid.number', locale), channel);

                        embed.setDescription(Translation.getCommand('configure.music.queue_limit_change', locale).replaceAll('{user}', message.author)
                            .replaceAll('{limit}', `**${args[2]}**`));

                        Database.Music.setQueueLimit(message.guild.id, parseInt(args[2]), client.config);
                        channel.send(embed);
                        break;
                    }
                    case "song_display_limit": {
                        if (args.length < 2) return MessageUtil.sendWrongUsage(channel, this.getUsage(), 'configure music song_display_limit 10');

                        if (isNaN(parseInt(args[2]))) return MessageUtil.sendError(Translation.getError('invalid.number', locale), channel);

                        embed.setDescription(Translation.getCommand('configure.music.song_display_limit_change', locale).replaceAll('{user}', message.author)
                            .replaceAll('{limit}', `**${args[2]}**`));

                        Database.Music.setSongDisplayLimit(message.guild.id, parseInt(args[2]), client.config);
                        channel.send(embed);
                        break;
                    }
                    case "time_limit": {
                        if (args.length < 2) return MessageUtil.sendWrongUsage(channel, this.getUsage(), 'configure music time_limit 60');

                        if (isNaN(parseInt(args[2]))) return MessageUtil.sendError(Translation.getError('invalid.number', locale), channel);

                        embed.setDescription(Translation.getCommand('configure.music.time_limit_change', locale).replaceAll('{user}', message.author)
                            .replaceAll('{limit}', `**${args[2]}**`));

                        Database.Music.setChooseTimeLimit(message.guild.id, parseInt(args[2]), client.config);
                        channel.send(embed);
                        break;
                    }
                    default: {
                        embed.setDescription(Translation.getError('invalid.option').replaceAll('{option}', args[1])
                            .replaceAll('{available_options}', '**queue_limit, song_display_limit, time_limit**'));
                        channel.send(embed);
                    }
                }
                break;
            }
            default: {
                const embed = new Discord.RichEmbed().setColor("LUMINOUS_VIVID_PINK");
                embed.setDescription(Translation.getError('invalid.option').replaceAll('{option}', args[0])
                    .replaceAll('{available_options}', '**prefix, music**'));
                channel.send(embed);
            }
        }
    }
}

module.exports = Configure;