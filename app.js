const Discord = require("discord.js");
const bot = new Discord.Client();

const rotoworld = require("./lib/rotoworld");
const utilities = require("./lib/utilities");
const espn = require("./lib/espn");

bot.on("message", msg => {
    // Let's get the first word to get any command namespace.
    let messageCommand = msg.content.substr(0, msg.content.indexOf(" "));
    let messageArgs = msg.content.substr(msg.content.indexOf(" ") + 1);

    // Let's filter through these now.
    // TODO: Make this not a terrible switch situation.
    switch (messageCommand) {
        case ".choose":
            utilities.chooseOne(messageArgs).then(function (chosen) {
                msg.channel.sendMessage(chosen);
            });
            break;
        case ".roto":
            rotoworld.getPlayer(messageArgs).then(function (player) {
                if (!player) {
                    msg.channel.sendMessage('No player found. Check the spelling of the player\'s name.');
                } else {
                    msg.channel.sendMessage(player.name + ': ' + player.latestNews + '\r\n\r\n' + player.latestImpact);
                }
            }).catch(function (err) {
                console.log(err);
            });
            break;
        case ".next5":
            espn.next5(messageArgs).then(function (schedule) {
            });
            break;
    }
});

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.login(process.env.DiscordAPIToken);