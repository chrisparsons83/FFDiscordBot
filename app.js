const Discord = require('discord.js');
const config = require('./config');
const commands = require('./lib/commands');

const bot = new Discord.Client();

bot.on('guildMemberAdd', (member) => {
  member.guild.defaultChannel.send(`Welcome to the /r/fantasyfootball discord server, ${member}`);
});

bot.on('message', (msg) => {
  if (msg.content.startsWith('!')) {
    let messageCommand = '';
    let messageArgsArray = [];
    [messageCommand, ...messageArgsArray] = msg.content.toString().split(' ').map(value => value.trim()).slice(0);
    const messageArgs = messageArgsArray.join(' ');
    const validCommand = Object.prototype.hasOwnProperty.call(commands, messageCommand);

    if (validCommand) {
      commands[messageCommand](messageArgs).then((response) => {
        msg.channel.send(response);
      }).catch((err) => {
        msg.channel.send(err);
      });
    }
  }
});

bot.login(config.DiscordAPIToken);
