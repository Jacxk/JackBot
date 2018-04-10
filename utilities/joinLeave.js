const Jimp = require("jimp");

module.exports.imageOnJoin = (member, channel) => {

    new Jimp(1024, 450, function (err, image) {
        if (err) throw err;
        Jimp.loadFont('./fonts/jellydonut128/font.fnt').then((font) => {
            image.print(font, 150, 230, "WELCOME", 500);
        });

        Jimp.loadFont('./fonts/jellydonut64/font.fnt').then((font) => {
            const name = member.user.tag.split(' ').join('');
            image.print(font, Math.floor(image.bitmap.width / 4) - (name.length * 7), 370, name, 500);
        });

        Jimp.read(member.user.avatarURL).then(avatar => {
            avatar.cover(240, 240, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
            image.composite(avatar, Math.floor((image.bitmap.width / 2) - avatar.bitmap.width / 2),
                Jimp.HORIZONTAL_ALIGN_CENTER).write('./images/join.png');
        });
    });

    setTimeout(() => channel.send({file: "./images/join.png"}), 3 * 1000);
};

module.exports.imageOnLeave = (member, channel) => {

    new Jimp(1024, 450, function (err, image) {
        if (err) throw err;
        Jimp.loadFont('./fonts/jellydonut128/font.fnt').then((font) => {
            image.print(font, 150, 230, "GoodBye", 500);
        });

        Jimp.loadFont('./fonts/jellydonut64/font.fnt').then((font) => {
            const name = member.user.tag.split(' ').join('');
            image.print(font, Math.floor(image.bitmap.width / 4) - (name.length * 7), 370, name, 500);
        });

        Jimp.read(member.user.avatarURL).then(avatar => {
            avatar.cover(240, 240, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
            image.composite(avatar, Math.floor((image.bitmap.width / 2) - avatar.bitmap.width / 2),
                Jimp.HORIZONTAL_ALIGN_CENTER).write('./images/leave.png');
        });
    });

    setTimeout(() => channel.send({file: "./images/leave.png"}), 3 * 1000);
};