const Discord = require("discord.js");
const bot = new Discord.Client();

const rotoworld = require("./lib/rotoworld");

bot.on("message", msg => {
    if (msg.content.startsWith(".roto")) {
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