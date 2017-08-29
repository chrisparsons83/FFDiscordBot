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

const commands = {};

commands['!8ball'] = question => new Promise((resolve, reject) => {
  if (!question) {
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
  if (!args) {
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
              description: `${utilities.returnDepthChartStrings(object.teamname, position, object.roster[position])}`,
              url: object.url,
              color: 11913417,
              thumbnail: { url: object.logo },
            },
          };
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
    } else if (!validPosition.includes(args[0]) || !validFormat.includes(args[1])) {
      reject('Invalid position/format.\nValid positions are ***qb, rb, wr, te, k , dst***.\nValid scoring formats are ***standard, half, full***');
    } else {
      const position = args[0].toLowerCase();
      const scoring = args[1].toLowerCase();
      boris.getTier(position, scoring).then((object) => {
        const url = object.url;
        const embed = {
          embed: {
            title: `Boris ${position.toUpperCase()} tiers`,
            description: utilities.returnBorisTiers(object.string, position),
            color: 11913417,
            url,
            thumbnail: { url: 'https://s3-us-west-1.amazonaws.com/fftiers/out/weekly-ALL-HALF-PPR-adjust0.png' },
            fields: [],
          },
        };
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

// reserved command for choosing player based on boris ranking
// will wait till boris releases flex ranking;

commands['!wdis'] = string => new Promise((resolve, reject) => {
  const args = string.split(',');
  const validPosition = ['qb', 'rb', 'te', 'wr', 'k', 'dst'];
  const validFormat = ['standard', 'half', 'full'];
  // if array have less than three elements
  if (args.length !== 3) {
    reject('Invalid query. Missing position/scoring format/players')
  }
  const position = args[0].replace(/\s/g, '').toLowerCase();
  const format = args[1].replace(/\s/g, '').toLowerCase();
  let players = args[args.length - 1].toLowerCase().split('|').filter(name => name.trim(''));
  // check for valid position or format
  if (!validPosition.includes(position) || !validFormat.includes(format)) {
    reject('Invalid position/format. Please check your position/format.');
  }
  // check if user gave 0 players to rank from
  if (players.length < 1) {
    reject('Please give me players to rank from!');
  }
  // check if dst is queried
  if (position === 'dst') {
    players = players.map(ele => ele.trim());
    players.forEach((item) => {
      if (!(item.toUpperCase() in teamLookup)) {
        reject('Invalid team symbols. Please double check the team symbols.');
      }
    });
    players = players.map(ele => teamLookup[ele.toUpperCase()].name.toLowerCase());
  }
  // check to see if the players exist in the players file, and reject
  // if the position is wrong for one of the valid players
  if (format !== 'flex') {
    for (let i = 0; i < players.length; i += 1) {
      const matched = utilities.findPlayer(players[i]);
      if (matched && matched.position !== position) {
        reject('Invalid position for the players');
      }
    }
  // for flex position
  }

  // if given only one valid player
  if (players.length === 1) {
    reject(`Umm...really? Just start ${players[0].split(' ').filter(String).join(' ')}.`);
  // if user query a tean instead of player names
  } else {
    boris.getTier(position, format).then((object) => {
      const message = `Boris says: "Start **${utilities.rankPlayers(object, players, position)}**."`;
      resolve(message);
    }).catch((err) => {
      reject(err);
    });
  }
  // check if each arguments is valid, position are valid, if format is valid
});

/* temp test comamnds
commands['!goodbot'] = () => new Promise((resolve, reject) => {
  // add a count to good bot stats
});

commands['!badbot'] = () => new Promise((resolve, reject) => {
  // add a count to good bot stats and write to goodbotbadbot json file
  botStats.bad += 1;
});
*/
module.exports = commands;
