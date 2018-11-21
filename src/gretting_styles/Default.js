const ImageUtil = require('../utilities/classes/ImageUtil.js');

const Jimp = require('jimp');

class Default {
    constructor() {
        this.style = 'default';
    }

    async createFile(channel, member) {
        const image = new Jimp(1024, 450);
        const avatar = await Jimp.read(member.user.displayAvatarURL);

        const font = await ImageUtil.loadFont('VeraMono', 64);

        const nameImage = new Jimp(1920, 1080);
        const welcomeImage = new Jimp(1920, 1080);
        const memberCount = new Jimp(1920, 1080);
        const date = new Jimp(1920, 1080);

        nameImage.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, member.user.tag.replaceAll(' ', ''));
        welcomeImage.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, 'Welcome');
        memberCount.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, '#' + member.guild.memberCount);
        date.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_MIDDLE, ImageUtil.getDate());

        nameImage.autocrop();
        welcomeImage.autocrop();
        memberCount.autocrop();
        date.autocrop();

        nameImage.resize(Jimp.AUTO, 40);
        welcomeImage.resize(Jimp.AUTO, 60);
        memberCount.resize(Jimp.AUTO, 50);
        date.resize(Jimp.AUTO, 35);

        avatar.cover(280, 280, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
        image.composite(avatar, Jimp.VERTICAL_ALIGN_MIDDLE, Math.floor((image.bitmap.height / 2) - (avatar.bitmap.height / 2)));
        image.composite(welcomeImage, 320, 100);
        image.composite(nameImage, 320, 165);
        image.composite(date, 320, 320);
        image.composite(memberCount, (image.bitmap.width - memberCount.bitmap.width) - 20, 20);

        ImageUtil.sendFile(channel, image)
    }
}

module.exports = Default;