const data = require("../data.json");
const fs = require("fs");

module.exports.run = (message, args) => {
    const guild = message.guild;
    message.delete();
    if (message.member.id !== "266315409735548928") return;

    if (args.length === 2 && args[1] === 'reset') {
        guild.members.forEach(member => {
            member.setNickname(data[member.id]).catch(err => {
            });
        });
        return;
    }

    guild.members.forEach(member => {
        data[member.id] = member.displayName;
        fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
            if (err) console.log(err)
        });
        member.setNickname("💩 HI THERE 💩").catch(err => {
        });
    });
};

module.exports.command = {
    name: "april",
    aliases: ["1", "afirst"]
};
