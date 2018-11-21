const Command = require('../../utilities/classes/Command.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');

class Profile extends Command {
    constructor() {
        super('profile', ["prof"]);
        this.setUsage('profile');
        this.setCategory('statistics');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        let member = message.mentions.members.first() || message.member;
        const embed = new Discord.RichEmbed();
        const locale = client.getLocale(message.guild.id);

        let playingStatus = member.presence.game;
        let roles = member.roles.filter(r => r !== member.guild.defaultRole).map(role => role.name);

        playingStatus = playingStatus ? member.presence.game.name : "N/A";

        embed.setThumbnail(member.user.avatarURL).addField(Translation.get('current_name', locale), member.displayName, false)
            .addField(Translation.get('current_level', locale), '0', true)
            .addField(Translation.get('playing', locale), playingStatus, true)
            .addField(Translation.get('roles', locale), roles.length < 1 ? 'N/A' : roles, true)
            .addField(Translation.get('join_date', locale), member.joinedAt.toDateString(), true)
            .addField(Translation.get('bio', locale), Translation.get('empty_bio', locale))
            .setColor(member.highestRole.color);

        channel.send(embed);

    }

}

module.exports = Profile;