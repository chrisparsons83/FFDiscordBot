const Discord = require('discord.js');
const config = require('./config');
const commands = require('./lib/commands');

const bot = new Discord.Client();

bot.on('guildMemberAdd', (member) => {
    member.guild.defaultChannel.send(`Welcome to the /r/fantasyfootball discord server, ${member}`);
});

bot.on('message', (msg) => {
    // Let's get the first word to get any command namespace.
    const messageCommand = msg.content.substr(0, msg.content.indexOf(' '));
    // const validCommand = commands.hasOwnProperty(messageCommand);
    const validCommand = Object.prototype.hasOwnProperty.call(commands, messageCommand);

    if (msg.content.startsWith('!') && validCommand) {
        // get bot command arguments
        // !8ball am i going to win?, messageArgs should be 'am i going to win?';
        const messageArgs = msg.content.substr(msg.content.indexOf(' ') + 1, msg.content.length);

        commands[messageCommand](messageArgs).then((response) => {
            msg.channel.send(response);
        }).catch((err) => {
            msg.channel.send(err);
        });
    }
});

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.login(config.DiscordAPIToken);
