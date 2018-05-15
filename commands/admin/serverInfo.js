const os = require('os');
const ms = require('ms');
const convert = require('convert-units');
const Discord = require('discord.js');

module.exports.run = (message) => {

    const totalMem = os.totalmem;
    const freeMem = os.freemem;
    const hostname = os.hostname;
    const platform = os.platform();
    const uptime = os.uptime;
    const cpu = os.cpus()[0].model;

    const embed = new Discord.RichEmbed();
    embed.addField('Total Memory', Math.floor(convert(totalMem).from('b').to('Mb')) + 'Mb', true);
    embed.addField('Free Memory', Math.floor(convert(freeMem).from('b').to('Mb')) + 'Mb', true);
    embed.addField('Used Memory', Math.floor(convert(totalMem - freeMem).from('b').to('Mb')) + 'Mb', true);
    embed.addField('Host Name', hostname, true);
    embed.addField('Platform', platform, true);
    embed.addField('Uptime', ms(Math.floor(uptime * 1000)), true);
    embed.addField('CPU', cpu, true);
    embed.setColor('RANDOM');
    embed.setTitle('Host Information');

    message.channel.send(embed);
};

module.exports.command = {
    name: 'sri',
    permission: "ADMINISTRATOR",
    enabled: false
};