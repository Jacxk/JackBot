const Music = require('./Schemas.js').Music;
const CachedData = require('./CachedData.js');

const getMusicSettings = module.exports.getMusicSettings = function (guild_id, cb) {
    return Music.findOne({guild_id}, async (err, doc) => {
        if (err) return cb(err);
        return cb(null, doc);
    });
};

module.exports.setQueueLimit = function (guild_id, limit, config) {
    getMusicSettings(guild_id, function (err, doc) {
        if (err) return console.error(err);
        if (!doc) new Music({
            guild_id,
            queue_limit: limit,
            song_display_limit: config.music.song_display_limit,
            time_limit: config.music.time_limit
        }).save();
        else {
            const data = {
                guild_id,
                queue_limit: limit,
                song_display_limit: doc.song_display_limit,
                time_limit: doc.time_limit
            };

            Music.updateOne({guild_id}, data, null, (err) => {
                if (err) return console.error(err)
            });
        }

        if (!CachedData.music_settings[guild_id]) return CachedData.music_settings[guild_id] = {
            queue_limit: limit,
            song_display_limit: config.music.song_display_limit,
            time_limit: config.music.time_limit
        };

        CachedData.music_settings[guild_id].queue_limit = limit;
    })
};

module.exports.setSongDisplayLimit = function (guild_id, limit, config) {
    getMusicSettings(guild_id, function (err, doc) {
        if (err) return console.error(err);
        if (!doc) return new Music({
            guild_id,
            queue_limit: config.music.queue_limit,
            song_display_limit: limit,
            time_limit: config.music.time_limit
        }).save();
        else {
            const data = {
                guild_id,
                queue_limit: doc.queue_limit,
                song_display_limit: limit,
                time_limit: doc.time_limit
            };

            Music.updateOne({guild_id}, data, null, (err) => {
                if (err) return console.error(err)
            });
        }

        if (!CachedData.music_settings[guild_id]) return CachedData.music_settings[guild_id] = {
            queue_limit: config.music.queue_limit,
            song_display_limit: limit,
            time_limit: config.music.time_limit
        };

        CachedData.music_settings[guild_id].song_display_limit = limit;
    })
};

module.exports.setChooseTimeLimit = function (guild_id, limit, config) {
    getMusicSettings(guild_id, function (err, doc) {
        if (err) return console.error(err);
        if (!doc) return new Music({
            guild_id,
            queue_limit: config.music.queue_limit,
            song_display_limit: config.music.song_display_limit,
            time_limit: limit
        }).save();
        else {
            const data = {
                guild_id,
                queue_limit: doc.queue_limit,
                song_display_limit: doc.song_display_limit,
                time_limit: limit
            };

            Music.updateOne({guild_id}, data, null, (err) => {
                if (err) return console.error(err)
            });
        }

        if (!CachedData.music_settings[guild_id]) return CachedData.music_settings[guild_id] = {
            queue_limit: config.music.queue_limit,
            song_display_limit: config.music.song_display_limit,
            time_limit: limit
        };

        CachedData.music_settings[guild_id].time_limit = limit;
    })
};