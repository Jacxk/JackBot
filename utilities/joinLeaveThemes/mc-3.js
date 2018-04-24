const Jimp = require("jimp");

module.exports.join = (member, channel) => {
    Jimp.read('./utilities/joinLeaveThemes/images/mc-bg-3.png').then(image => {
        const nameImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/minecraftia/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.user.tag.split(' ').join(''));
                image.autocrop();
                image.resize(Jimp.AUTO, 40);
            }).catch(err => console.log(err));
        });

        const welcomeImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/minecraftia/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, 'Welcome');
                image.autocrop();
                image.resize(Jimp.AUTO, 60);
            }).catch(err => console.log(err));
        });

        const memberCount = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/minecraftia/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, '#' + member.guild.memberCount);
                image.autocrop();
                image.resize(Jimp.AUTO, 50);
            }).catch(err => console.log(err));
        });

        const date = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/minecraftia/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.joinedAt.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    hour12: true,
                    day: 'numeric'
                }));
                image.autocrop();
                image.resize(Jimp.AUTO, 35);
            }).catch(err => console.log(err));
        });

        Jimp.read(member.user.avatarURL).then(avatar => {
            avatar.cover(280, 280, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

            Jimp.read('./utilities/joinLeaveThemes/images/squared-white-border.png').then(border => {
                image.composite(avatar, 50, Math.floor((image.bitmap.height / 2) - (avatar.bitmap.height / 2)))
                    .composite(welcomeImage, 350, 100).composite(nameImage, 350, 165).composite(date, 350, 320)
                    .composite(memberCount, (image.bitmap.width - memberCount.bitmap.width) - 40, 60)
                    .composite(border, 50, Math.floor((image.bitmap.height / 2) - (avatar.bitmap.height / 2)));

                image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                    channel.send({file: buffer});
                });
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
};

module.exports.leave = (member, channel) => {
    Jimp.read('./utilities/joinLeaveThemes/images/mc-bg-3.png').then(image => {
        const nameImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/minecraftia/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.user.tag.split(' ').join(''));
                image.autocrop();
                image.resize(Jimp.AUTO, 40);
            }).catch(err => console.log(err));
        });

        const welcomeImage = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/minecraftia/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, 'GoodBye');
                image.autocrop();
                image.resize(Jimp.AUTO, 60);
            }).catch(err => console.log(err));
        });

        const date = new Jimp(1920, 1080, (err, image) => {
            if (err) throw err;
            Jimp.loadFont('./fonts/minecraftia/font.fnt').then((font) => {
                image.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.joinedAt.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    hour12: true,
                    day: 'numeric'
                }));
                image.autocrop();
                image.resize(Jimp.AUTO, 35);
            }).catch(err => console.log(err));
        });

        Jimp.read(member.user.avatarURL).then(avatar => {
            avatar.cover(280, 280, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

            Jimp.read('./utilities/joinLeaveThemes/images/squared-white-border.png').then(border => {
                image.composite(avatar, 50, Math.floor((image.bitmap.height / 2) - (avatar.bitmap.height / 2)))
                    .composite(welcomeImage, 350, 100).composite(nameImage, 350, 165).composite(date, 350, 320)
                    .composite(border, 50, Math.floor((image.bitmap.height / 2) - (avatar.bitmap.height / 2)));

                image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                    channel.send({file: buffer});
                });
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
};
