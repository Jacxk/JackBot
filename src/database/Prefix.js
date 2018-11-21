const Prefixes = require('./Schemas.js').Prefix;
const CachedData = require('./CachedData.js');

const getPrefix = module.exports.getPrefix = function (guild_id, cb) {
    return Prefixes.findOne({guild_id}, async (err, doc) => {
        if (err) return cb(err);
        return cb(null, doc);
    });
};

module.exports.setPrefix = function (guild_id, prefix, changed_by) {
    getPrefix(guild_id, function (err, doc) {
        if (err) return console.error(err);
        if (!doc) new Prefixes({
            prefix,
            times_changed: 1,
            guild_id,
            changed_by,
            last_changed: new Date()
        }).save();
        else {
            const times_changed = doc.times_changed + 1;
            const data = {prefix, times_changed, guild_id, changed_by, last_changed: new Date()};

            Prefixes.updateOne({guild_id}, data, null, (err) => {
                if (err) return console.error(err.toString())
            });
        }

        CachedData.prefixes[guild_id] = prefix;
    })
};