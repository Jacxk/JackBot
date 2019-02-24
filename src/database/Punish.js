const Punishments = require('./Schemas.js');

module.exports.warn = function (staff, member, reason) {
    const punishSchema = Punishments.punishments(staff.guild.id);

    new punishSchema({
        type: "warn",
        reason,
        when: new Date(),
        punished: member.id,
        punisher: staff.id,
        time: null,
        permanent: true
    }).save();
};

module.exports.report = function (staff, member, reason) {
    const punishSchema = Punishments.punishments(staff.guild.id);

    new punishSchema({
        type: "report",
        reason,
        when: new Date(),
        punished: member.id,
        punisher: staff.id,
        time: null,
        permanent: true
    }).save();
};

module.exports.kick = function (staff, member, reason) {
    const punishSchema = Punishments.punishments(staff.guild.id);

    new punishSchema({
        type: "kick",
        reason,
        when: new Date(),
        punished: member.id,
        punisher: staff.id,
        time: null,
        permanent: true
    }).save();
};

module.exports.ban = function (staff, member, reason, time) {
    const punishSchema = Punishments.punishments(staff.guild.id);

    new punishSchema({
        type: "ban",
        reason,
        when: new Date(),
        punished: member.id,
        punisher: staff.id,
        time: time,
        permanent: time === 0
    }).save();
};

module.exports.mute = function (staff, member, reason, time) {
    const punishSchema = Punishments.punishments(staff.guild.id);

    new punishSchema({
        type: "mute",
        reason,
        when: new Date(),
        punished: member.id,
        punisher: staff.id,
        time: time,
        permanent: time === 0
    }).save();
};

module.exports.getPunishment = function (user, amount = 1, type, cb) {
    let find = {punished: user.id};
    if (type) find = Object.assign(find, {type});

    const punishSchema = Punishments.punishments(user.guild.id);
    const query = punishSchema.find(find);

    query.limit(amount);
    query.sort('-when');
    query.exec(function (err, docs) {
        if (err) return cb(err);
        cb(null, docs);
    });
};

module.exports.getPunishmentCount = async function (user, type) {
    const punishSchema = Punishments.punishments(user.guild.id);
    let find = {punished: user.id};
    if (type) find = Object.assign(find, {type});

    const query = await punishSchema.countDocuments(find);

    return await query.exec();
};