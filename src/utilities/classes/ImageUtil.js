const Jimp = require("jimp");

class ImageUtil {
    static sendFile(channel, image) {
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            channel.send({file: buffer});
        });
    }

    static horizontalAlign(image1, image2) {
        return Math.floor((image1.bitmap.width / 2) - (image2.bitmap.width / 2))
    }

    static getDate(date) {
        date = date ? date : new Date();
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            hour12: true,
            day: 'numeric'
        });
    }

    static async loadFont(name, size) {
        return await Jimp.loadFont(`./src/assets/fonts/${size}/${name}/font.fnt`);
    }

    static color(image, color) {
        return image.color([{apply: 'mix', params: [color, 100]}])
    }
}

module.exports = ImageUtil;