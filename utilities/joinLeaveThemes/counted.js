const Jimp = require("jimp");

module.exports.join = (member, channel) => {
    new Jimp(1024, 450, function (err, image) {
        if (err) throw err;

        const nameImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut64/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.user.tag.split(' ').join(''));
                image.autocrop();
                image.resize(Jimp.AUTO, 40);
            });
        });

        const welcomeImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut128/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, 'WELCOME');
                image.autocrop();
                image.resize(Jimp.AUTO, 60);
            });
        });

        const memberCount = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut128/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, '#' + member.guild.memberCount);
                image.autocrop();
                image.resize(Jimp.AUTO, 50);
            });
        });

        const date = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut128/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.joinedAt.toDateString());
                image.autocrop();
                image.resize(Jimp.AUTO, 35);
            });
        });

        Jimp.read(member.user.avatarURL).then(avatar => {
            avatar.cover(280, 280, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

            Jimp.read('./utilities/joinLeaveThemes/images/squared-white-border.png').then(border => {
                image.composite(avatar, Jimp.VERTICAL_ALIGN_MIDDLE, Math.floor((image.bitmap.height / 2) - (avatar.bitmap.height / 2)))
                    .composite(welcomeImage, 320, 100).composite(nameImage, 320, 165).composite(date, 320, 320)
                    .composite(memberCount, (image.bitmap.width - memberCount.bitmap.width) - 20, 20)
                    .composite(border, Jimp.VERTICAL_ALIGN_MIDDLE, Math.floor((image.bitmap.height / 2) - (avatar.bitmap.height / 2)));

                image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                    channel.send({file: buffer});
                });
            });
        }).catch(err => console.log(err));
    });
};

module.exports.leave = (member, channel) => {
    new Jimp(1024, 450, function (err, image) {
        if (err) throw err;

        const nameImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut64/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.user.tag.split(' ').join(''));
                image.autocrop();
                image.resize(Jimp.AUTO, 40);
            });
        });

        const goodbyeImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut128/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, 'GoodBye');
                image.autocrop();
                image.resize(Jimp.AUTO, 60);
            });
        });

        const date = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/jellydonut128/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.joinedAt.toDateString());
                image.autocrop();
                image.resize(Jimp.AUTO, 35);
            });
        });

        Jimp.read(member.user.avatarURL).then(avatar => {
            avatar.cover(280, 280, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

            Jimp.read('./utilities/joinLeaveThemes/images/squared-white-border.png').then(border => {
                image.composite(avatar, Jimp.VERTICAL_ALIGN_MIDDLE, Math.floor((image.bitmap.height / 2) - (avatar.bitmap.height / 2)))
                    .composite(goodbyeImage, 320, 100).composite(nameImage, 320, 165).composite(date, 320, 320)
                    .composite(border, Jimp.VERTICAL_ALIGN_MIDDLE, Math.floor((image.bitmap.height / 2) - (avatar.bitmap.height / 2)));

                image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                    channel.send({file: buffer});
                });
            });
        }).catch(err => console.log(err));
    });
};
