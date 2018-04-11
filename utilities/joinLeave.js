const Jimp = require("jimp");

module.exports.imageOnJoin = (member, channel) => {

    new Jimp(1024, 450, function (err, image) {
        if (err) throw err;
        const nameImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut64/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.user.tag.split(' ').join(''));
                image.autocrop();
            });
        });

        const welcomeImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut128/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, 'WELCOME');
                image.autocrop();
            });
        });

        Jimp.read(member.user.avatarURL).then(avatar => {
            avatar.cover(240, 240, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
            image.composite(welcomeImage, Math.floor(image.bitmap.width / 2) - (welcomeImage.bitmap.width / 2), 240)
                .composite(nameImage, Math.floor(image.bitmap.width / 2) - (nameImage.bitmap.width / 2), 370)
                .composite(avatar, Math.floor((image.bitmap.width / 2) - (avatar.bitmap.width / 2)),
                    Jimp.HORIZONTAL_ALIGN_CENTER);
            image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                channel.send({file: buffer});
            });
        });
    });

};

module.exports.imageOnLeave = (member, channel) => {

    new Jimp(1024, 450, function (err, image) {
        if (err) throw err;

        const nameImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut64/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.user.tag.split(' ').join(''));
                image.autocrop();
            });
        });

        const byeImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut128/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, 'GoodBye');
                image.autocrop();
            });
        });

        Jimp.read(member.user.avatarURL).then(avatar => {
            avatar.cover(240, 240, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
            image.composite(byeImage, Math.floor(image.bitmap.width / 2) - (byeImage.bitmap.width / 2), 240)
                .composite(nameImage, Math.floor(image.bitmap.width / 2) - (nameImage.bitmap.width / 2), 370)
                .composite(avatar, Math.floor((image.bitmap.width / 2) - (avatar.bitmap.width / 2)),
                    Jimp.HORIZONTAL_ALIGN_CENTER);
            image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                channel.send({file: buffer});
            });
        });
    });

};