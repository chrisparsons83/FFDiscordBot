const Discord = require("discord.js");
const bot = new Discord.Client();

const rotoworld = require("./lib/rotoworld");
const utilities = require("./lib/utilities");

bot.on("message", msg => {
    // Let's get the first word to get any command namespace.
    let messageCommand = msg.content.substr(0, msg.content.indexOf(" "));
    let messageArgs = msg.content.substr(msg.content.indexOf(" ") + 1);

    // Let's filter through these now.
    // TODO: Make this not a terrible if/elseif/switch situation.
    if (messageCommand == ".choose") {
        utilities.chooseOne(messageArgs).then(function (chosen) {
            msg.channel.sendMessage(chosen);
        });
    }
    else if (messageCommand == ".roto") {
        let [task, ...playerName] = msg.content.split(" ").slice(1);
        playerName = playerName.join(" ");
        switch (task) {
            case 'news':
                rotoworld.getPlayer(playerName).then(function (player) {
                    if (!player) {
                        msg.channel.sendMessage('No player found. Check the spelling of the player\'s name.');
                    } else {
                        msg.channel.sendMessage(player.name + ': ' + player.latestNews + '\r\n\r\n' + player.latestImpact);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
                break;
            default:
                msg.channel.sendMessage('Invalid, valid commands are \'news\'n');
        }
    }
});

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.login(process.env.DiscordAPIToken);