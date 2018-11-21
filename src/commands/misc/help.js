const Command = require('../../utilities/classes/Command.js');
const Translation = require('../../utilities/classes/Translation.js');
const CachedData = require('../../database/CachedData.js');

const Discord = require('discord.js');

class Help extends Command {
    constructor() {
        super('help');
        this.setUsage('[command]');
        this.setCategory('misc');
    }

    async execute(message, args, client) {
        const embed = new Discord.RichEmbed().setColor('ORANGE');
        const commands = client.setup.commands;
        const categories = ["dev", "moderation", "music", "statistics", "fun", "administration", "misc"].sort();
        const prefix = CachedData.prefixes[message.guild.id] || client.config.default_prefix;
        const locale = client.getLocale(message.guild.id);

        if (args.length > 0) {
            const embed = new Discord.RichEmbed();
            const command = commands.get(args[0]);

            embed.setTitle(Translation.getCommand('help.embed.title').replaceAll('{0}', command.getName())).setColor('ORANGE');
            embed.setDescription(
                `**${Translation.get('description', locale)}**: ${Translation.getCommand(command.getDescription(), locale)}\n` +
                `**${Translation.get('usage', locale)}**: ${prefix + command.getUsage()}\n` +
                `**${Translation.get('category', locale)}**: ${Translation.getCategory(command.getCategory().toLowerCase(), locale)}\n` +
                `**${Translation.get('aliases', locale)}**: ${command.getAliases().length > 0 ? command.getAliases().join(', ') : 'N/A'}\n` +
                `**${Translation.get('enabled', locale)}**: ${Translation.get(command.isEnabled() ? 'yes' : 'no', locale)}\n` +
                `**${Translation.get('permission_needed', locale)}**: ${command.getPermission()}\n`
            );
            message.channel.send(embed);
            return;
        }

        categories.forEach(category => {
            const command = commands.filter(cmd => cmd.getCategory() === category);
            if (command.size > 0) {
                if (client.config.dev_users.includes(message.member.id) && category === 'dev')
                    embed.addField(category, command.map(c => prefix + c._name).join('\n'), true);
                else if (category !== 'dev')
                    embed.addField(category, command.map(c => prefix + c._name).join('\n'), true);
            }
        });

        embed.setFooter(Translation.getCommand('help.embed.footer', locale).replaceAll('{0}',
            client.setup.commands.filter(c => {
                if (c.isDevOnly() && client.config.dev_users.includes(message.member.id)) return true;
                return c.isEnabled() && !c.isDevOnly()
            }).size));
        embed.setDescription(Translation.getCommand(this.getDescription(), locale));
        message.channel.send(embed).catch(err => console.error(err.toString()));
    }
}

module.exports = Help;