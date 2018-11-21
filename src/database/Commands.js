const Commands = require('./Schemas.js').Commands;

const getCommand = function (name, cb) {
    return Commands.findOne({name}, async (err, doc) => {
        if (err) return cb(err);
        return cb(null, doc);
    });
};

module.exports.setCommand = function (name, data) {
    getCommand(name, function (err, doc) {
        if (err) return console.error(err);

        if (!doc) {
            data.last_updated = new Date();
            return new Commands(data).save();
        }

        const docu = {
            name: doc.name,
            description: doc.description,
            permission: doc.permission,
            usage: doc.usage,
            category: doc.category,
            aliases: doc.aliases,
        };
        if (docu === data) return;

        data.last_updated = new Date();
        Commands.updateOne({guild_id: name}, data, null, (err) => {
            if (err) return console.error(err.toString())
        });
    })
};