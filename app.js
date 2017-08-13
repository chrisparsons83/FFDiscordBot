const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config");
const commands = require('./lib/commands');

bot.on('guildMemberAdd', (guild, member) => {
  guild.channels.get(guild.defaultChannel.id).sendMessage(`Welcome to the /r/fantasyfootball discord server, ${member}`);
});

bot.on("message", msg => {
    // Let's get the first word to get any command namespace.
    let messageCommand = msg.content.substr(0, msg.content.indexOf(" "));
    let validCommand = commands.hasOwnProperty(msg.content.split(' ')[0]);

    if (msg.content.startsWith('!') && validCommand) {
      // get bot command
      let messageCommand = msg.content.split(' ')[0];
      
      // get bot command arguments
      // !8ball am i going to win?, messageArgs should reference 'am i going to win?';
      let messageArgs = msg.content.substr(msg.content.indexOf(' ')+1, msg.content.length);

      commands[messageCommand](messageArgs).then(response => {
        // check to see if resolved promised is an object
        if (typeof response === 'object') {
          msg.channel.sendMessage(response.message);
        } else {
          msg.channel.sendMessage(response);
        }
      })
      // error catching
      .catch(err => {
        msg.channel.sendMessage(err);
      });
    }
});

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.login(config.DiscordAPIToken);