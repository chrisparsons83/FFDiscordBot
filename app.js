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
    // Create an object with data to send to the commands
    const messageObject = {
      user: msg.author,
      args: messageArgs,
      channel: msg.channel,
    };
    if (validCommand) {
      commands[messageCommand](messageObject).then((response) => {
        // Check to see if there's a channel passed as a key/value in the object.
        if (response.message) {
          // If so, this is the new format for the bot.
          // If there's a channel name stored in the object, then we want to send it to
          // that particular channel if it exists. Otherwise
          // TODO: When we add a database to this, this needs to be able to be configured
          // on the server level.
          if (response.channelName) {
            const channel = msg.member.guild.channels.find('name', response.channelName);
            if (!channel) return;
            channel.send(response.message);
          }
        } else {
          // Otherwise, just send the response.
          // TODO: Convert all the old responses to the new
          msg.channel.send(response);
        }
      }).catch((err) => {
        msg.channel.send(err);
      });
    }
  }
});

bot.login(config.DiscordAPIToken);
