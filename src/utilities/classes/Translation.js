const fs = require('fs');
const languages = module.exports.languages = new Map();

class Translation {
    static get(path, language = 'english') {
        if (!path) return 'No path specified';

        let langFile = languages.get(language);
        if (!langFile) return `The language ${language} was not found.`;

        path = path.split('.');

        function getObject(object, data) {
            if (object.length > 0) {
                data = data[object[0]];
                if (!data) return path.join('.');
                object = object.slice(1);
                return getObject(object, data);
            }
            return data;
        }

        return getObject(path, langFile);
    }

    static getCategory(category, lang) {
        return this.get(`categories.${category}`, lang)
    }

    static getCommand(command, lang) {
        return this.get(`commands.${command}`, lang)
    }

    static getSuccess(path, lang) {
        return this.get(`success.${path}`, lang)
    }

    static getError(path, lang) {
        return this.get(`errors.${path}`, lang);
    }

    static getBans(path, lang) {
        return this.get(`punishment.bans.${path}`, lang)
    }

    static getKicks(path, lang) {
        return this.get(`punishment.kicks.${path}`, lang)
    }

    static getWarns(path, lang) {
        return this.get(`punishment.warns.${path}`, lang)
    }

    static getReports(path, lang) {
        return this.get(`punishment.reports.${path}`, lang)
    }

    static getMute(path, lang) {
        return this.get(`punishment.mute.${path}`, lang)
    }

    static loadFiles() {
        const files = fs.readdirSync('./src/languages/');
        files.forEach(file => {
            const name = file.split('.')[0];
            languages.set(name, JSON.parse(fs.readFileSync('./src/languages/' + name + '.json', "utf8")));
        })
    }
}

module.exports = Translation;