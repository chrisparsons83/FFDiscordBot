const Discord = require('discord.js');
const Knex = require('knex');
const { Model } = require('objection');

const config = require('./config');
const commands = require('./lib/commands');
const commandsList = require('./stats/commandsList.json');
const utilities = require('./lib/utilities');
const knexConfig = require('./knexfile');

// Database models
const News = require('./models/News');

// Initialize knex.
const knex = Knex(knexConfig);
Model.knex(knex);

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('message', (msg) => {
  if (msg.content.startsWith('!')) {
    let messageCommand = '';
    let messageArgsArray = [];
    [messageCommand, ...messageArgsArray] = msg.content
      .toString()
      .split(' ')
      .map(value => value.trim())
      .slice(0);
    const messageArgs = messageArgsArray.join(' ');

    // Make sure message command is case insensitive, but rest of string should matter on case.
    messageCommand = messageCommand.toLowerCase();

    // Confirm that the command called exists.
    const validCommand = Object.prototype.hasOwnProperty.call(commands, messageCommand);
    // check to see if there was a minor typo in the command
    const closeEnough = utilities.checkMinorTypo(
      messageCommand.slice(1, messageCommand.length),
      commandsList,
    );
    // Create an object with data to send to the commands
    const messageObject = {
      user: msg.author,
      args: messageArgs,
      channel: msg.channel,
    };
    if (validCommand) {
      commands[messageCommand](messageObject)
        .then((response) => {
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
        })
        .catch((err) => {
          if (err.message) {
            msg.channel.send(err.message);
          } else {
            msg.channel.send(err);
          }
        });
    } else if (closeEnough) {
      msg.channel.send(`*Did you mean* \`${closeEnough}\` *?*`);
    }
  }
});

// We're going to use this as a way to setup a polling service to post news to
// all of the servers we're connected to.
bot.on('ready', () => {
  // Start an interval loop that fires every 30 seconds.
  (async function updateNews() {
    // Check to see if there's any new news - we don't need to do anything if there isn't
    const newNews = await News.query().where('is_published', '=', false);

    if (newNews.length > 0) {
      // Set those stories to published now
      // There's a race condition here but I'm too lazy to fix it. Someone should
      // fix it at some point (that someone will likely be me).
      const publishedNews = await News.query()
        .patch({ is_published: true })
        .where('is_published', '=', false);

      // Check to see what servers are connected to this bot
      const guildList = bot.guilds.array();
      // Loop through each server
      try {
        guildList.forEach((guild) => {
          // Check to see if they have an ff-news channel
          const channel = guild.channels.find(val => val.name === 'ff-news');
          // if no channel, then skip this
          if (channel) {
            // If so, post each news story we need to publish
            newNews.forEach((article) => {
              const embed = new Discord.RichEmbed()
                .setAuthor(article.author)
                .setTitle(article.title)
                .setDescription(article.description);
              channel.send(embed);
            });
          }
        });
      } catch (err) {
        console.log(`Could not send message to ${guild.name}`);
      }
    }

    // Pause for 30 seconds to give the server a break.
    setTimeout(updateNews, 30000);
  }());
});

bot.login(config.DiscordAPIToken);
