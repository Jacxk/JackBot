const Discord = require('discord.js');
const translate = require('google-translate-api');
const config = require('../config.json');

module.exports.run = (message, args) => {
    let embed = new Discord.RichEmbed();
    if (args.length === 1) return message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('You need to enter a language and the text to translate')
        .setFooter(`Usage: ${config.prefix}translate [lang] [text]`).then(m => m.delete(5000)));
    if (args.length === 2) return message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('You need to enter the text you want to translate')
        .setFooter(`Usage: ${config.prefix}translate [lang] [text]`).then(m => m.delete(5000)));

    message.delete();

    let toTranslate = args.join(' ').substring(args[0].length + args[1].length + 1);
    translate(toTranslate, {to: args[1]}).then(res => {

        embed.setColor("AQUA");
        embed.setAuthor(message.author.username, message.author.avatarURL);
        embed.addField('Message to Translate', toTranslate);
        embed.addField('Translated Message', res.text);
        embed.addField('Translated From', langs[res.from.language.iso], true);
        embed.addField('Translated To', args[1], true);
        embed.setFooter('Translated by: Google Translate', 'https://is1-ssl.mzstatic.com/image/thumb/Purple128/v4/88/86/0c/88860cd7-5d79-7bfc-59bd-d544b37ed967/logo_translate_color-1x_U007emarketing-85-220-0-5.png/246x0w.jpg');

        message.channel.send(embed);
    }).catch(err => console.error(err));
};


module.exports.command = {
    name: 'translate'
};

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