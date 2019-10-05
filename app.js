#!/usr/bin/env node

const Discord = require('discord.js');
const config = require('./config');
const base_commands = require('./lib/commands');
const user_extensions = require('./lib/user_extensions');
const commands={
  ...base_commands,
  ...user_extensions
}
const commandsList = require('./stats/commandsList.json')
const utilities = require('./lib/utilities');
const bot = new Discord.Client();

bot.on('ready', () => {
  bot.user.setActivity('<%help for more info>');
});

bot.on('message', (msg) => {
  if (msg.content.startsWith('%')) {
    let messageCommand = '';
    let messageArgsArray = [];
    [messageCommand, ...messageArgsArray] = msg.content.toString().split(' ')
      .map(value => value.trim()).slice(0);
    const messageArgs = messageArgsArray.join(' ');

    // Make sure message command is case insensitive, but rest of string should matter on case.
    messageCommand = messageCommand.toLowerCase();

    // Confirm that the command called exists.
    const validCommand = Object.prototype.hasOwnProperty.call(commands, messageCommand);
    // check to see if there was a minor typo in the command
    const closeEnough = utilities.checkMinorTypo(messageCommand.slice(1, messageCommand.length),commandsList)
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
        }  else {
          // Otherwise, just send the response.
          // TODO: Convert all the old responses to the new
          msg.channel.send(response);
        }
      }).catch((err) => {
        msg.channel.send(err);
      });
    } else if (closeEnough) {
      msg.channel.send(`*Did you mean* \`${closeEnough.replace('!', '%')}\` *?*`)
    }
  }
});

bot.login(config.DiscordAPIToken);
