const Schema = require('./Schemas.js');
const CachedData = require('./CachedData.js');

module.exports.addAnnouncement = function (user, announcement_name, announcement_text, announce_rate) {
    const guildId = user.guild.id;
    const announcementsSchema = Schema.announcements(guildId);

    new announcementsSchema({
        guild_id: guildId,
        announcement_name,
        announcement_text,
        announce_rate,
        created_by: user.id,
        date: new Date(),
        last_edited: new Date()
    }).save();

    const data = CachedData.announcements[guildId];
    if (!data) CachedData.announcements[guildId] = {};
    CachedData.announcements[guildId][announcement_name] = {
        announcement_name,
        announcement_text,
        announce_rate,
        created_by: user.id
    }
};

module.exports.getAnnouncement = function (guild_id, announcement_name, cb) {
    const announcementsSchema = Schema.announcements(guild_id);

    announcementsSchema.findOne({guild_id}, function (err, doc) {
        if (err) return cb(err);
        if (!doc) return cb("Doc does not exist!");
        cb(null, doc);
    });
};