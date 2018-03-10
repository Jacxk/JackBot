const Discord = require('discord.js');
const translate = require('google-translate-api');
const config = require('../config.json');

module.exports.run = (message, args) => {
    let embed = new Discord.RichEmbed();
    message.delete();

    if (args.length === 1) return message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('You need to enter a language and the text to translate')
        .setFooter(`Usage: ${config.prefix}translate [lang] [text]`)).then(m => m.delete(10000));
    if (args.length === 2) return message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription('You need to enter the text you want to translate')
        .setFooter(`Usage: ${config.prefix}translate [lang] [text]`)).then(m => m.delete(10000));

    let translateTo = args[1].split('_').join(' ');
    if (translateTo.toLowerCase().includes('chinese')) translateTo = 'Chinese Simplified';
    let toTranslate = args.join(' ').substring(args[0].length + translateTo.length + 1);

    translate(toTranslate, {to: translateTo}).then(res => {

        embed.setColor("AQUA");
        embed.setAuthor(message.author.username, message.author.avatarURL);
        embed.addField('Message to Translate', toTranslate);
        embed.addField('Translated Message', res.text);
        embed.addField('Translated From', langs[res.from.language.iso], true);
        embed.addField('Translated To', translateTo, true);
        embed.setFooter('Translated by: Google Translate', 'https://cdn.dribbble.com/users/1341307/screenshots/3641494/google_translate.gif');
        message.channel.send(embed);
    }).catch(err => message.channel.send(embed.setColor("RED").setTitle('❌ ERROR ❌')
        .setDescription(err.toString().replace('Error: ', '')).setFooter(`Usage: ${config.prefix}translate [lang] [text]`))
        .then(m => m.delete(10000)));
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