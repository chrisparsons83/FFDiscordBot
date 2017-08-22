const utilities = require('./utilities.js');
const rotoworld = require('./rotoworld.js');
const espn = require('./espn.js');
const stats = require('./teamstats.js');
const lib4for4 = require('./4for4.js');
const depthChart = require('./depthchart.js');
const teamLookup = require('../stats/teamLookup.json');
const polly = require('./polly.js');
const boris = require('./borischen.js');
const Discord = require('discord.js');
const botStats = require('../stats/goodbotbadbot.json');
const fs = require('fs');
const path = require('path');

const commands = {};

commands['!8ball'] = question => new Promise((resolve, reject) => {
  if (question === '') {
    reject('I can\'t answer your question if you don\'t give me one!');
  } else {
    resolve(utilities.eightBall());
  }
});

commands['!adp'] = name => new Promise((resolve, reject) => {
  lib4for4.getADP(name).then((resultObject) => {
    let returnString = `ADP as of ${resultObject.LastUpdated} via 4for4 for `;
    returnString += `${resultObject.name}: `;
    returnString += `ESPN: ${resultObject.ADP.ESPN}`;
    returnString += `, MFL: ${resultObject.ADP.MFL}`;
    returnString += `, NFL: ${resultObject.ADP.NFL}`;
    returnString += `, Yahoo: ${resultObject.ADP.Yahoo}`;
    resolve(returnString);
  }).catch((error) => {
    reject(error);
  });
});

commands['!choose'] = args => new Promise((resolve, reject) => {
  if (args === '!choose') {
    reject('I need things to choose from!');
  } else {
    resolve(utilities.chooseOne(args));
  }
});

commands['!next5'] = team => new Promise((resolve, reject) => {
  espn.next5(team).then((results) => {
    const scheduleString = results.schedule.map((game) => {
      const gameDayDisplay = !['Sunday', ''].includes(game.gameDay) ? `(${game.gameDay})` : '';
      return `${game.weekNumber}. ${game.location}${game.opponent.mascot} ${game.gameTime} ${gameDayDisplay}`;
    }).join('\r\n');

    const embed = new Discord.RichEmbed()
      .setTitle(`${results.team.name} Remaining Schedule`)
      .setThumbnail(results.team.logo)
      .setDescription(scheduleString);

    resolve({ embed });
  }).catch((error) => {
    reject(error);
  });
});

commands['!schedule'] = team => new Promise((resolve, reject) => {
  espn.remainingGames(team).then((results) => {
    const scheduleString = results.schedule.map((game) => {
      const gameDayDisplay = !['Sunday', ''].includes(game.gameDay) ? `(${game.gameDay})` : '';
      return `${game.weekNumber}. ${game.location}${game.opponent.mascot} ${game.gameTime} ${gameDayDisplay}`;
    }).join('\r\n');

    const embed = new Discord.RichEmbed()
      .setTitle(`${results.team.name} Remaining Schedule`)
      .setThumbnail(results.team.logo)
      .setDescription(scheduleString);

    resolve({ embed });
  }).catch((error) => {
    reject(error);
  });
});

commands['!roto'] = name => new Promise((resolve, reject) => {
  if (name === '!roto') {
    reject('I need a name to lookup!');
  } else {
    rotoworld.getPlayer(name).then((playerObject) => {
      const embedToSend = {
        embed: {
          title: `${playerObject.name} (${playerObject.team})`,
          url: playerObject.url,
          thumbnail: {
            url: playerObject.playerPhoto,
          },
          author: {
            name: 'Rotoworld.com',
            url: playerObject.url,
            icon_url: 'http://rotoworld.com/favicon.ico',
          },
          fields: [
            {
              name: 'Latest News',
              value: playerObject.latestNews,
            },
            {
              name: 'Impact',
              value: playerObject.latestImpact,
            },
          ],
        },
      };
      resolve(embedToSend);
    }).catch((error) => {
      reject(error);
    });
  }
});

// get team abbreviations
commands['!symbols'] = () => new Promise((resolve) => {
  resolve(utilities.symbolsLookup());
});

// get team stats
commands['!teamstats'] = input => new Promise((resolve, reject) => {
  const valid = input.toUpperCase() in teamLookup;
  if (input === '!teamstats') {
    reject('I need a team symbol.');
  } else if (!valid) {
    reject('Invalid team symbol.');
  } else {
    const teamname = teamLookup[input.toUpperCase()].name;
    const symbol = input.toUpperCase();
    const object = stats.getBreakdown(teamname, symbol);
    const embed = {
      embed: {
        title: `${teamname}`,
        description: '2016 Offensive stats (League average)',
        color: 11913417,
        thumbnail: {
          url: teamLookup[symbol].logo,
        },
        fields: [{ name: 'Total offensive plays', value: `${object.offensivePlay}` },
          { name: 'Total passing plays', value: `${object.passingPercentage}` },
          { name: 'Passing yards attempted', value: `${object.passingYards}`, inline: true },
          { name: 'Yards per passing attempt', value: `${object.yardsPerPass}`, inline: true },
          { name: 'Short passes', value: `${object.shortPass}`, inline: true },
          { name: 'Deep passes', value: `${object.deepPass}`, inline: true },
          { name: 'Total rushing plays', value: `${object.rushingPercentage}` },
          { name: 'Total rushing yards', value: `${object.rushingYards}`, inline: true },
          { name: ' Yards per rushing attempt', value: `${object.yardsPerRush}`, inline: true },
        ],
      },
    };
    resolve(embed);
  }
});

commands['!teamtargets'] = teamname => new Promise((resolve, reject) => {
  const valid = teamname.toUpperCase() in teamLookup;
  if (teamname === '!top8targets') {
    reject('I need a team symbol.');
  } else if (!valid) {
    reject('Invalid team symbol.');
  } else {
    const team = teamLookup[teamname.toUpperCase()].name;
    const teamStats = `\`\`\`${stats.getTargets(teamname)}\`\`\``;
    resolve(`**${team}'s 2016 Top 5**\n(Penalties and interception targets are excluded)${teamStats}`);
  }
});

commands['!help'] = () => new Promise((resolve) => {
  resolve('For command list, see https://github.com/chrisparsons83/RedditFFDiscordBot');
});

commands['!depthchart'] = (string) => {
  const arg = string.split(',');
  return new Promise((resolve, reject) => {
    if (arg.length < 2) {
      reject('Invalid request. Missing team symbol and/or team position.');
    } else {
      const teamname = arg[0].toUpperCase().replace(/\s/g, '');
      const position = arg[1].toLowerCase().replace(/\s/g, '');
      const validPosition = ['qb', 'rb', 'fb', 'wr', 'te', 'kr', 'pr', 'k', 'lt', 'lg', 'c', 'rg', 'rt', 'ldt', 'lde', 'ndt', 'rdt',
        'rde', 'mlb', 'slb', 'wlb', 'rcb', 'lcb', 'ss', 'fs', 'p', 'ls', 'h'];
      if (!(teamname in teamLookup)) {
        resolve('Invalid team symbol. Please check your query.');
      } else if (!validPosition.includes(position)) {
        resolve('Invalid position. Please check your query.');
      } else {
        depthChart.getRoster(teamname, position).then((object) => {
          const embed = {
            embed: {
              title: `${object.teamname}`,
              description: `2017 ${object.positionName} depth chart`,
              url: object.url,
              color: 11913417,
              thumbnail: { url: object.logo },
              fields: [],
            },
          };
          for (let i = 0; i < object.roster[position].length; i += 1) {
            embed.embed.fields.push({ name: `${position.toUpperCase()} #${i + 1}`, value: object.roster[position][i], inline: true });
          }
          resolve(embed);
        }).catch((err) => {
          resolve(err);
        });
      }
    }
  });
};

commands['!poll'] = (string) => {
//! poll <poll_question> | <poll_option_1> | <poll_option_2> | etc...
  const args = string.split('|');
  return new Promise((resolve, reject) => {
    if (args.length < 3) {
      reject('Invalid poll. Please check your questions/answers.');
    } else {
      const question = args[0];
      const answers = [];
      for (let i = 1; i < args.length; i += 1) {
        answers.push(args[i]);
      }
      const url = polly.getPoll(question, answers);
      resolve(url);
    }
  });
};

commands['!boris'] = (string) => {
  const args = string.replace(/\s/g, '').split(',');
  return new Promise((resolve, reject) => {
    const validPosition = ['qb', 'rb', 'te', 'wr', 'k', 'dst'];
    const validFormat = ['standard', 'half', 'full'];
    if (args.length < 2) {
      reject('Invalid query. Please give me a position and scoring format. Make sure to include the comma as well.');
    } else if (!(args[0] in validPosition) || !(args[1] in validFormat)) {
      reject('Invalid position/format. Valid positions are *qb, rb, wr, te, k , dst*.\nValid format are *standard, half, full*');
    } else {
      const position = args[0].toLowerCase();
      const scoring = args[1].toLowerCase();
      boris.getTier(position, scoring).then((object) => {
        // let list = object.string.replace(/\n/g, '').split('Tier');
        const url = object.url;
        const embed = {
          embed: {
            title: `Boris ${position.toUpperCase()} tiers`,
            color: 11913417,
            url,
            thumbnail: { url: 'https://s3-us-west-1.amazonaws.com/fftiers/out/weekly-ALL-HALF-PPR-adjust0.png' },
            fields: [],
          },
        };
        object.string.forEach((item) => {
          const tierNumber = item.split(':')[0];
          const nameList = item.split(':')[1].slice(1, item.split(':')[1].length);
          embed.embed.fields.push({ name: `Tier${tierNumber}`, value: `${nameList}`, inline: true });
        });
        resolve(embed);
      }).catch((err) => {
        reject(err);
      });
    }
  });
};

// testing findplayer utility function
commands['!find'] = string => new Promise((resolve, reject) => {
  const results = utilities.findPlayer(string);
  if (!results) {
    reject('Cannot find player');
  } else {
    resolve(`Fuzzy score: ${results.score}\nPlayer found: ${results.fullname}\nTeam: ${results.team}`);
  }
});

commands['!goodbot'] = () => new Promise((resolve, reject) => {
  // add a count to good bot stats and write to goodbotbadbot json file
  botStats.good += 1;
  fs.writeFile(path.join(__dirname, '../stats/goodbotbadbot.json'), JSON.stringify(botStats, null, 2), 'utf-8', (err) => {
    if (err) reject(err);
  });
  resolve(`Thank you. :smiley:\nGood bot count:${botStats.good}`);
});

commands['!badbot'] = () => new Promise((resolve, reject) => {
  // add a count to good bot stats and write to goodbotbadbot json file
  botStats.bad += 1;
  fs.writeFile(path.join(__dirname, '../stats/goodbotbadbot.json'), JSON.stringify(botStats, null, 2), 'utf-8', (err) => {
    if (err) reject(err);
  });
  resolve(`I'm a bad bot. :cry:\nBadbot count:${botStats.bad}`);
});

module.exports = commands;
