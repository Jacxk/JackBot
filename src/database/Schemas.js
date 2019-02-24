const configurationsConnection = require('./connections/Configurations.js');
const punishmentsConnection = require('./connections/Punishments.js');
const usersConnection = require('./connections/Users.js');

const Discord = require("discord.js");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const guildPunishments = new Discord.Collection();
const guildAnnouncements = new Discord.Collection();

const Prefix = new Schema({
    guild_id: String,
    prefix: String,
    last_changed: Date,
    changed_by: String,
    times_changed: Number
});

const Commands = new Schema({
    name: String,
    description: String,
    permission: String,
    usage: String,
    category: String,
    aliases: Array,
    last_updated: Date
});

const Music = new Schema({
    guild_id: String,
    queue_limit: Number,
    song_display_limit: Number,
    time_limit: Number
});

const TicTacToe = new Schema({
    user_id: String,
    wins: Number,
    losses: Number,
    draws: Number,
    last_matches: Array
});

function punishments(guildId) {
    if (guildPunishments.get(guildId)) return guildPunishments.get(guildId);
    const punishment = new Schema({
        type: String,
        reason: String,
        when: Date,
        punished: String,
        punisher: String,
        time: Number,
        permanent: Boolean
    });

    guildPunishments.set(guildId, punishmentsConnection.model(guildId, punishment));
    return guildPunishments.get(guildId);
}

function announcements(guildId) {
    if (guildAnnouncements.get(guildId)) return guildAnnouncements.get(guildId);
    const Announcements = new Schema({
        guild_id: String,
        announcement_name: String,
        announcement_text: String,
        announce_rate: Number,
        created_by: String,
        date: Date,
        last_edited: Date
    });

    guildAnnouncements.set(guildId, guildAnnouncements.model(guildId, Announcements));
    return guildAnnouncements.get(guildId);
}

module.exports = {
    Prefix: configurationsConnection.model('prefixes', Prefix),
    Commands: configurationsConnection.model('commands', Commands),
    Music: configurationsConnection.model('music', Music),
    TicTacToe: usersConnection.model('tictactoe', TicTacToe),
    punishments,
    announcements
};
