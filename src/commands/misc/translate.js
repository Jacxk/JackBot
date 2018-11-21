const Command = require('../../utilities/classes/Command.js');
const Translation = require('../../utilities/classes/Translation.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');

const Discord = require('discord.js');
const translate = require('google-translate-api');

class Translate extends Command {
    constructor() {
        super('translate', ["trans"]);
        this.setCategory('misc');
        this.setUsage('<lang> <text>');
    }

    async execute(message, args, client) {
        const channel = message.channel;
        const embed = new Discord.RichEmbed();

        if (args.length < 2) return MessageUtil.sendWrongUsage(channel, 'translate <lang> <text>', 'translate spanish I am the best bot');

        let translateTo = args[0].split('_').join(' ');
        if (translateTo.toLowerCase().includes('chinese')) translateTo = 'Chinese Simplified';
        let toTranslate = args.slice(1).join(" ");

        translate(toTranslate, {to: translateTo}).then(res => {
            embed.setColor("AQUA");
            embed.setAuthor(message.author.username, message.author.avatarURL);
            embed.addField('Message to Translate', toTranslate);
            embed.addField('Translated Message', res.text);
            embed.addField('Translated From', langs[res.from.language.iso], true);
            embed.addField('Translated To', translateTo, true);
            embed.setFooter('Translated by: Google Translate', 'https://cdn.dribbble.com/users/1341307/screenshots/3641494/google_translate.gif');
            channel.send(embed);
        }).catch(err => MessageUtil.sendError(err.toString(), channel));
    }
}

const langs = {
    'auto': 'Automatic',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese Simplified',
    'zh-tw': 'Chinese Traditional',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ma': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
};

module.exports = Translate;