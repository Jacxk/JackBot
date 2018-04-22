const commands = [
    {
        name: "8ball",
        description: "This ball can tell you the future.",
        usage: "-8ball [question]",
        permission: "None",
        aliases: "fortune",
        category: "Fun"
    },
    {
        name: "addEmote",
        description: "Add an emote to the guild.",
        usage: "-addEmote [name] [image link]",
        permission: "Administrator",
        aliases: "None",
        category: "Admin"
    },
    {
        name: "ban",
        description: "Ban a member that is not behaving.",
        usage: "-ban [user] [reason]",
        permission: "Administrator",
        aliases: "None",
        category: "Moderation"
    },
    {
        name: "botInfo",
        description: "Show info about the bot, such as uptime.",
        usage: "-botInfo",
        permission: "None",
        aliases: "binfo, boti",
        category: "Misc"
    },
    {
        name: "changeLog",
        description: "See the changes made to the bot and website throughout time.",
        usage: "-changeLog {version}",
        permission: "None",
        aliases: "clog, chlog",
        category: "Misc"
    },
    {
        name: "clear",
        description: "Clear the specified number of messages.",
        usage: "-clear [number of messages]",
        permission: "Manage Messages",
        aliases: "c, cc",
        category: "Moderation"
    },
    {
        name: "currentSong",
        description: "Displays the current song playing",
        usage: "-currentSong ",
        permission: "None",
        aliases: "csong, playing, current",
        category: "Music"
    },
    {
        name: "delEmote",
        description: "Remove a custom emote from the guild.",
        usage: "-delEmote [emote name]",
        permission: "Administrator",
        aliases: "None",
        category: "Admin"
    },
    {
        name: "fortnite",
        description: "Check your stats from Fortnite's database",
        usage: "-fortnite [platform] [username] {gamemode}",
        permission: "None",
        aliases: "fortn, fnite, fnt",
        category: "Stats"
    },
    {
        name: "guildInfo",
        description: "Get information about the guild.",
        usage: "-guildInfo",
        permission: "None",
        aliases: "ginfo, guildi",
        category: "Misc"
    },
    {
        name: "help",
        description: "Get help about all the commands.",
        usage: "-help",
        permission: "None",
        aliases: "None",
        category: "Misc"
    },
    {
        name: "hypixel",
        description: "Check your stats from Hypixel's database.",
        usage: "-hypixel [player name] [gamemode]",
        permission: "None",
        aliases: "hyp, hpxl",
        category: "Stats"
    },
    {
        name: "invite",
        description: "Get a message with a link to invite me :D",
        usage: "-invite",
        permission: "None",
        aliases: "None",
        category: "Misc"
    },
    {
        name: "issue",
        description: "If the bot is broken or something use this to send me a message.",
        usage: "-issue [message]",
        permission: "Administrator",
        aliases: "None",
        category: "Misc"
    },
    {
        name: "kick",
        description: "Kick a member if you are felling like you have to.",
        usage: "-kick [user] [reason]",
        permission: "Kick Members",
        aliases: "k, kck",
        category: "Moderation"
    },
    {
        name: "meme",
        description: "Want some memes? This is your lucky command... Maybe...",
        usage: "-meme {subReddit}",
        permission: "None",
        aliases: "None",
        category: "Fun"
    },
    {
        name: "mute",
        description: "Mute someone if he is not shutting up.",
        usage: "-mute [user] [reason]",
        permission: "Administrator",
        aliases: "None",
        category: "Moderation"
    },
    {
        name: "profile",
        description: "Check your or someone else's profile.",
        usage: "-profile {user}",
        permission: "None",
        aliases: "pr, prof",
        category: "Stats"
    },
    {
        name: "rankUp",
        description: "Are you lazy and don't want to add a role manually? Use this command :D",
        usage: "-rankUp [user] [roleName]",
        permission: "Administrator",
        aliases: "None",
        category: "Admin"
    },
    {
        name: "say",
        description: "Want your bot to send a message? No? ok then...",
        usage: "-say [message]",
        permission: "Administrator",
        aliases: "broadcast, bc",
        category: "Admin"
    },
    {
        name: "setup",
        description: "Setup the guild's channel, etc.",
        usage: "-setup [argument 1] [argument 2] || -setup help",
        permission: "Administrator",
        aliases: "settings, stp, stt",
        category: "Admin"
    },
    {
        name: "tempMute",
        description: "Mute someone for the assigned period of time.",
        usage: "-tempMute [user] [time] [reason]",
        permission: "Manage Messages",
        aliases: "tempm, tmute, tm",
        category: "Moderation"
    },
    {
        name: "play",
        description: "Wanna hear some music? Then what are you waiting for.",
        usage: "-play [song/url]",
        permission: "None",
        aliases: "p, pl",
        category: "Music"
    },
    {
        name: "queue",
        description: "Get a list of the songs in the queue",
        usage: "-queue",
        permission: "None",
        aliases: "q",
        category: "Music"
    },
    {
        name: "skip",
        description: "You don't like the song? Skip it then",
        usage: "-skip",
        permission: "None",
        aliases: "s, skp",
        category: "Music"
    },
    {
        name: "translate",
        description: "If you use this command you're lazy...",
        usage: "-translate [lang] [message]",
        permission: "None",
        aliases: "trans",
        category: "Misc"
    },
    {
        name: "unban",
        description: "Is someone banned and you want to unban him? Why you banned him then?",
        usage: "-unban [user id]",
        permission: "Ban Members",
        aliases: "None",
        category: "Moderation"
    },
    {
        name: "unMute",
        description: "Do I really need to explain what this does? I'm tired of writing.",
        usage: "-unMute [user]",
        permission: "Manage Messages",
        aliases: "umute, unm",
        category: "Moderation"
    },
    {
        name: "urbanDictionary",
        description: "Check the definition of a word...",
        usage: "-urbanDictionary [word]",
        permission: "None",
        aliases: "def, define, ud, urbandef, urband, udef",
        category: "Fun"
    },
    {
        name: "volume",
        description: "OMG! the music is to loud, TURN IT DOWN!!!",
        usage: "-volume [number]",
        permission: "None",
        aliases: "vol",
        category: "Music"
    },
    {
        name: "warn",
        description: "Warn a user because why not...",
        usage: "-warn [user] [reason]",
        permission: "Manage Messages",
        aliases: "wn, w",
        category: "Moderation"
    },
    {
        name: "weather",
        description: "Check the weather of a city.",
        usage: "-weather city",
        permission: "None",
        aliases: "climate, wea",
        category: "Misc"
    }
];

function getCommands(category) {
    let html = '';
    commands.forEach((value) => {
        if (category.toLowerCase() !== value.category.toLowerCase() && category.toLowerCase() !== 'all') return;
        html += '<div class="commandsBox">';
        html += '<div class="card-body">';
        html += `<h5 class="card-title" style="font-size: 32px">${value.name}</h5>`;
        html += `<hr style="background-color: #18191c">`;
        html += `<pre class="card-text" style="font-size: 18px">`;
        html += `<b>Description: </b>${value.description}<br>`;
        html += `<b>Usage: </b>${value.usage}<br>`;
        html += `<b>Permission: </b>${value.permission}<br>`;
        html += `<b>Aliases: </b>${value.aliases}<br>`;
        html += `<b>Category: </b>${value.category}<br>`;
        html += '</pre></div></div>'
    });
    document.getElementById('commandsDiv').innerHTML = html;
}

function search() {
    const input = document.getElementById("searchBox");
    const filter = input.value.toUpperCase();

    const mainDiv = document.getElementById("commandsDiv");
    const subDivs = mainDiv.getElementsByTagName("div");

    for (let i = 0; i < subDivs.length; i++) {
        const header = subDivs[i].getElementsByTagName("h5")[0];

        if (header.innerHTML.toUpperCase().includes(filter)) subDivs[i].style.display = "";
        else subDivs[i].style.display = "none";

    }
}

getCommands('All');
