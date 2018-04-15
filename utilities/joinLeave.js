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
            avatar.cover(280, 280, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

            Jimp.read('https://cloud.githubusercontent.com/assets/414918/11165709/051d10b0-8b0f-11e5-864a-20ef0bada8d6.png').then(mask => {
                mask.cover(280, 280, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
                avatar.mask(mask, 0, 0);

                image.composite(avatar, Math.floor((image.bitmap.width / 2) - (avatar.bitmap.width / 2)), Jimp.HORIZONTAL_ALIGN_CENTER)
                    .composite(welcomeImage, Math.floor(image.bitmap.width / 2) - (welcomeImage.bitmap.width / 2), 240)
                    .composite(nameImage, Math.floor(image.bitmap.width / 2) - (nameImage.bitmap.width / 2), 370);

                image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                    channel.send({file: buffer});
                });
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
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
            avatar.cover(280, 280, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

            Jimp.read('https://cloud.githubusercontent.com/assets/414918/11165709/051d10b0-8b0f-11e5-864a-20ef0bada8d6.png').then(mask => {
                mask.cover(280, 280, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
                avatar.mask(mask, 0, 0);

                image.composite(avatar, Math.floor((image.bitmap.width / 2) - (avatar.bitmap.width / 2)), Jimp.HORIZONTAL_ALIGN_CENTER)
                    .composite(byeImage, Math.floor(image.bitmap.width / 2) - (byeImage.bitmap.width / 2), 240)
                    .composite(nameImage, Math.floor(image.bitmap.width / 2) - (nameImage.bitmap.width / 2), 370);

                image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                    channel.send({file: buffer});
                });
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
    });

};