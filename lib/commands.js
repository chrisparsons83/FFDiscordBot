const utilities = require('./utilities.js');
const rotoworld = require('./rotoworld.js');
const espn = require('./espn.js');
const stats = require('./teamstats.js');
const lib4for4 = require('./4for4.js');
const depthChart = require('./depthchart.js');
const teamLookup = require('../stats/nflteamsdata.json');
const polly = require('./polly.js');
const boris = require('./borischen.js');
const Discord = require('discord.js');
const snapcounts = require('./snapcounts.js');
const year = 2019
const commands = {};

commands['!8ball'] = questionObject =>
  new Promise((resolve, reject) => {
    const question = questionObject.args;

    if (!question) {
      reject("I can't answer your question if you don't give me one!");
    } else {
      resolve(utilities.eightBall());
    }
  });

commands['!adp'] = nameObject =>
  new Promise((resolve, reject) => {
    const name = nameObject.args;

    lib4for4
      .getADP(name)
      .then((resultObject) => {
        let returnString = `ADP as of ${resultObject.LastUpdated} via 4for4 for `;
        returnString += `${resultObject.name} (12-team ADP): `;
        returnString += `ESPN: ${resultObject.ADP.ESPN} (${utilities.convertToPickPosition(resultObject.ADP.ESPN)})`;
        returnString += `, MFL: ${resultObject.ADP.MFL} (${utilities.convertToPickPosition(resultObject.ADP.MFL)})`;
        returnString += `, Yahoo: ${resultObject.ADP.Yahoo} (${utilities.convertToPickPosition(resultObject.ADP.Yahoo)})`;
        resolve(returnString);
      })
      .catch((error) => {
        reject(error);
      });
  });

commands['!choose'] = argsObject =>
  new Promise((resolve, reject) => {
    const args = argsObject.args;

    if (!args) {
      reject('I need things to choose from!');
    } else {
      resolve(utilities.chooseOne(args));
    }
  });

commands['!next5'] = teamObject =>
  new Promise((resolve, reject) => {
    const team = teamObject.args;

    espn
      .next5(team)
      .then((results) => {
        const scheduleString = results.schedule
          .map((game) => {
            const gameDayDisplay = !['Sunday', ''].includes(game.gameDay)
              ? `(${game.gameDay})`
              : '';
            return `${game.weekNumber}. ${game.location}${game.opponent.mascot} ${
              game.gameTime
            } ${gameDayDisplay}`;
          })
          .join('\r\n');

        const embed = new Discord.RichEmbed()
          .setTitle(`${results.team.name} Remaining Schedule`)
          .setThumbnail(results.team.logo)
          .setDescription(scheduleString);

        resolve({ embed });
      })
      .catch((error) => {
        reject(error);
      });
  });

commands['!next'] = teamObject =>
  new Promise((resolve, reject) => {
    const team = teamObject.args;
    espn
      .nextGame(team)
      .then((results) => {
        const scheduleString = results.schedule
          .map((game) => {
            const gameDayDisplay = !['Sunday', ''].includes(game.gameDay)
              ? `(${game.gameDay})`
              : '';
            return `**${game.location}${game.opponent.abbreviation} ${
              game.gameTime
            } ${gameDayDisplay}**`;
          })
          .join('\r\n');
        resolve(`${scheduleString}`);
      })
      .catch((error) => {
        reject(error);
      });
  });

commands['!schedule'] = teamObject =>
  new Promise((resolve, reject) => {
    const team = teamObject.args;

    espn
      .remainingGames(team)
      .then((results) => {
        const scheduleString = results.schedule
          .map((game) => {
            const gameDayDisplay = !['Sunday', ''].includes(game.gameDay)
              ? `(${game.gameDay})`
              : '';
            return `${game.weekNumber}. ${game.location}${game.opponent.mascot} ${
              game.gameTime
            } ${gameDayDisplay}`;
          })
          .join('\r\n');

        const embed = new Discord.RichEmbed()
          .setTitle(`${results.team.name} Remaining Schedule`)
          .setThumbnail(results.team.logo)
          .setDescription(scheduleString);

        resolve({ embed });
      })
      .catch((error) => {
        reject(error);
      });
  });

commands['!roto'] = nameObject =>
  new Promise((resolve, reject) => {
    const name = nameObject.args;

    if (name === '') {
      reject('I need a name to lookup!');
    } else {
      rotoworld
        .getPlayer(name)
        .then((playerObject) => {
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
                icon_url: 'https://www.rotoworld.com/themes/custom/rotoworld_theme/favicon.ico',
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
        })
        .catch((error) => {
          reject(error);
        });
    }
  });

commands['!teamstats'] = teamStatsObject =>
  new Promise((resolve, reject) => {
    const input = teamStatsObject.args.toLowerCase();
    const valid = teamLookup.filter((obj) => {
      if (obj.abbreviation.toLowerCase() === input || obj.mascot.toLowerCase() === input) {
        return obj;
      }
    });
    if (input === '') {
      reject('I need a team symbol.');
    } else if (valid.length === 0) {
      reject('Invalid team symbol or mascot.');
    } else {
      const teamname = valid[0].name;
      const teamlogo = valid[0].logo;
      const symbol = valid[0].abbreviation;
      const object = stats.getBreakdown(symbol);
      const embed = {
        embed: {
          title: `${teamname}`,
          description: `${year} Offensive stats (League average)`,
          color: 11913417,
          thumbnail: {
            url: teamlogo,
          },
          fields: [
            { name: 'Total offensive plays', value: `${object.offensivePlay}` },
            { name: 'Pass / Rush Ratio', value: `${object.passRushRatio}` },
            { name: 'Passing yards attempted', value: `${object.passingYards}`, inline: true },
            { name: 'Yards per passing attempt', value: `${object.yardsPerPass}`, inline: true },
            { name: 'Short passes', value: `${object.shortPass}`, inline: true },
            { name: 'Deep passes', value: `${object.deepPass}`, inline: true },
            { name: 'Total rushing yards', value: `${object.rushingYards}`, inline: true },
            { name: 'Yards per rushing attempt', value: `${object.yardsPerRush}`, inline: true },
          ],
        },
      };
      resolve(embed);
    }
  });

commands['!teamtargets'] = object =>
  new Promise((resolve, reject) => {
    const args = utilities.argumentSplit(object.args.toLowerCase());
   //if command only has team symbol as argument, it should default targets type to 'total'
    if (args.length == 1) {
      args.push('total')
    }

    const validFormat = ['total', 'deep', 'short', 'mid', 'left', 'right'];
    let teamArg = args[0];
    let type = args[1];
    if (validFormat.includes(teamArg)) {
      const temp = type;
      type = teamArg;
      teamArg = temp;
    }
    const valid = teamLookup.filter((obj) => {
      if (obj.abbreviation.toLowerCase() === teamArg || obj.mascot.toLowerCase() === teamArg) {
        return obj;
      }
    });
    if (!validFormat.includes(type)) {
      reject(
        '***Invalid target type.***\n*Target types are: (total, deep, short, mid, left, right)*',
      );
    }
    if (valid.length === 0) {
      reject('Invalid team symbol/mascot.');
    } else {
      const team = valid[0].abbreviation;
      const teamStats = `\`\`\`${stats.getTargets(team, type)}\`\`\``;
      resolve(
        `**${
          valid[0].name
        } ${year}'s ${type} targets**\n(Penalties and interception targets are excluded)${teamStats}`,
      );
    }
  });

commands['!help'] = () =>
  new Promise((resolve) => {
    resolve('For command list, see https://github.com/chrisparsons83/RedditFFDiscordBot');
  });

commands['!depthchart'] = (depthChartObject) => {
  const arg = utilities.argumentSplit(depthChartObject.args.toLowerCase());
  return new Promise((resolve, reject) => {
    if (arg.length < 2) {
      reject('Invalid request. Missing team symbol and/or team position.');
    } else {
      let team = arg[0];
      let position = arg[1];
      const validPosition = [
        'qb',
        'rb',
        'wr',
        'te',
        'k',
      ];
      // check to see if teamname and position was confused, if true, swap
      if (validPosition.includes(team.toLowerCase())) {
        const temp = team;
        team = position;
        position = temp;
      }
      const valid = teamLookup.filter((obj) => {
        if (obj.abbreviation.toLowerCase() === team || obj.mascot.toLowerCase() === team) {
          return obj;
        }
      });

      if (valid.length === 0) {
        resolve('Invalid team symbol/mascot. Please check your query.');
      }
      if (!validPosition.includes(position)) {
        resolve('Invalid position. Please check your query.');
      } else {
        depthChart
          .getRoster(valid[0].abbreviation, position)
          .then((object) => {
            const embed = {
              embed: {
                title: `${object.teamname} ${position.toUpperCase()}`,
                description: `${utilities.returnDepthChartStrings(
                  position,
                  object.roster[position],
                  object.roster.update,
                )}`,
                url: object.url,
                color: 11913417,
                thumbnail: { url: object.logo },
              },
            };
            resolve(embed);
          })
          .catch((err) => {
            resolve(err);
          });
      }
    }
  });
};

commands['!poll'] = (pollObject) => {
  const string = pollObject.args;

  const args = string
    .trim()
    .split('|')
    .filter(String);
  return new Promise((resolve, reject) => {
    if (args.length < 3) {
      reject('Invalid poll. Please check your questions/answers.');
    } else {
      const question = args[0];
      const answers = [];
      for (let i = 1; i < args.length; i += 1) {
        answers.push(args[i].trim());
      }
      const url = polly.getPoll(question, answers);
      resolve(url);
    }
  });
};

commands['!boris'] = (borisObject) => {
  let args = utilities.argumentSplit(borisObject.args.toLowerCase());
  return new Promise((resolve, reject) => {
    const noFormat = ['qb', 'k', 'dst'];
    const validPosition = ['qb', 'rb', 'te', 'wr', 'k', 'dst', 'flex'];
    const validFormat = ['standard', 'half', 'full'];
    let position = args[0];
    let scoring;
    if (args.length <= 1) {
      scoring = 'standard';
    } else {
      scoring = args[1];
    }
    // check if position and scoring format was a typo, swap if it was a mistake

    if (validPosition.includes(scoring)) {
      const temp = position;
      position = scoring;
      scoring = temp;
      args = [position, scoring];
    }
    // check if valid position
    if (!validPosition.includes(position)) {
      reject('Invalid position entered.\nValid positions are ***qb, rb, wr, te, k, dst, flex***');
    }
    // check if it needs format;
    if (noFormat.includes(position)) {
      scoring = 'standard';
      // check to see if scoring format is entered for a position that require scoring format
    } else if (args.length !== 2) {
      reject(
        'Invalid position/format.\nValid positions are ***qb, rb, wr, te, k , dst***.\nValid scoring formats are ***standard, half, full***',
      );
    } else {
      scoring = args[1].trim('').toLowerCase();
    }
    // if its a position that requires scoring format
    if (!validPosition.includes(position) || !validFormat.includes(scoring)) {
      reject(
        'Invalid position/format.\nValid positions are ***qb, rb, wr, te, k , dst***.\nValid scoring formats are ***standard, half, full***',
      );
    } else {
      boris
        .getTier(position, scoring)
        .then((object) => {
          const url = object.url;
          const embed = {
            embed: {
              title: `Boris ${position.toUpperCase()} tiers`,
              color: 11913417,
              url,
              thumbnail: {
                url:
                  'https://s3-us-west-1.amazonaws.com/fftiers/out/weekly-ALL-HALF-PPR-adjust0.png',
              },
              fields: [],
            },
          };
          object.string.forEach((item) => {
            const tierNumber = item.split(':')[0];
            const nameList = item.split(':')[1].slice(1, item.split(':')[1].length);
            embed.embed.fields.push({
              name: `Tier${tierNumber}`,
              value: `${nameList}`,
              inline: false,
            });
          });
          resolve(embed);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

commands['!find'] = findObject =>
  new Promise((resolve, reject) => {
    const findString = findObject.args;

    const results = utilities.findPlayer(findString);
    if (!results) {
      reject('Cannot find player');
    } else {
      resolve(
        `Fuzzy score: ${results.score}\nPlayer found: ${results.fullname}\nTeam: ${results.team}`,
      );
    }
  });

commands['!wdis'] = wdisObject =>
  new Promise((resolve, reject) => {
    const args = utilities.wdisHelper(wdisObject.args);

    if (args.length <= 1) {
      reject(
        'Invalid query.\nValid positions are ***qb, rb, te, k, dst, flex.***\nValid scoring are ***standard, half, full.***',
      );
    }
    const noFormat = ['qb', 'k', 'dst'];
    const validPosition = ['qb', 'rb', 'te', 'wr', 'k', 'dst', 'flex'];
    const validFormat = ['standard', 'half', 'full'];
    let position = args[0].toLowerCase();
    let format = args[1].toLowerCase();
    let players;


    // check if arguments are backward, if so swap it
    if (validPosition.includes(format)) {
      const temp = format;
      format = position;
      position = temp;
    }

    // check if the position argument is valid
    if (!validPosition.includes(position)) {
      reject(
        'You might be missing a comma or spelled the position wrong. \nValid positions are ***qb, rb, te, k, dst, flex.***',
      );
    }

    // if position given are qb, dst, or kicker, we shouldn't require the scoring format
    // we'll just give it a standard format
    if (noFormat.includes(position)) {
      format = 'standard';
    }

    // check if the scoring format argument is valid
    if (!validFormat.includes(format)) {
      reject(
        'You are missing a comma, scoring format, or spelled the scoring format wrong. \nValid scoring are ***standard, half, full.***',
      );
    }

    // check if dst is queried
    if (position === 'dst') {
      players = args
        .slice(1, args.length)
        .map(n => n.toLowerCase())
        .filter(n => ['dst', 'standard', 'half', 'full'].indexOf(n) < 0)
        .filter(n => n);
        
      players.forEach((item) => {
        const team = teamLookup.filter((obj) => {
          if (
            obj.abbreviation.toLowerCase() === item ||
            obj.mascot.toLowerCase() === item ||
            obj.name.toLowerCase() === item
          ) {
            return obj;
          }
        });
        if (team.length === 0) {
          reject('Invalid team symbol/name. Please double check the team symbol/name.');
        } else {
          // get index number of item in players
          const index = players.indexOf(item);
          players[index] = team[0].name.toLowerCase();
        }
      });

    // check if its position that doesnt require scoring format ie qb and k
    } else if (noFormat.includes(position)) {
      players = args
        .slice(1, args.length)
        .map(n => n.trim('').toLowerCase())
        .filter(n => ['k', 'qb', 'standard', 'half', 'full'].indexOf(n) < 0)
        .filter(n => n);

      players.forEach((player) => {
        const matched = utilities.findPlayer(player);
        if (!matched) {
          reject(
            "Player(s) doesn't exist in the database. Please use the player's full name.",
          );
        }
      });

    } else {
      players = args
        .slice(2, args.length)
        .map(item => item.trim('').toLowerCase())
        .filter(
          n => ['qb', 'rb', 'wr', 'te', 'k', 'dst', 'standard', 'half', 'full'].indexOf(n) < 0,
        )
        .filter(n => n);

      // check to see if player exist
      players.forEach((player) => {
        const matched = utilities.findPlayer(player);
        if (!matched) {
          reject(
            "Player(s) doesn't exist in the database. Please use the player's full name.",
          );
        }
      });
    }


    // check if scoring format is required
    if (!noFormat.includes(position) && !validFormat.includes(format)) {
      reject(
        'Missing scoring format and/or comma.\nValid format are ***standard, half,*** or ***full.***',
      );
    }
    // check for valid position
    if (!validPosition.includes(position)) {
      reject('Invalid position entered.\nValid positions are ***qb, rb, wr, te, k, dst, flex***');
    }

    // check if user gave 0 players to rank from
    if (players.length < 1) {
      reject('Please give me players to rank from!');
    }

    // if only one player returned remain after all checks and sanitization
    if (players.length === 1) {
      resolve(
        `Just start **${players[0]
          .trim()
          .split(' ')
          .map(item => item[0].toUpperCase() + item.slice(1, item.length))
          .join(' ')}**.`,
      );
    

    } else {
      boris
        .getTier(position, format)
        .then((object) => {
          const response = utilities.rankPlayers(object, players, position);
          let message;
          if (response.includes(',') || response.includes(' and ')) {
            message = `Boris says: **${response}** are in the same tier level at **${position.toUpperCase()}** with ${
              (format === 'full') ? '**1 PPR**' :
              (format === 'half') ? '**0.5 PPR**': '**Standard**'} format. Flip a coin or go with your gut.`;
          } else {
            message = `Boris says: "Start **${response}** at **${position.toUpperCase()}** with **${
              (format === 'full') ? '1 PPR' : 
              (format === 'half') ? '0.5 PPR': 'Standard'}** format."`;
          }
          resolve(message);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });

commands['!shuffle'] = argsObject =>
  new Promise((resolve, reject) => {
    const args = argsObject.args;
    if (!args) {
      reject('I need at least two items to shuffle!');
    } else {
      utilities.shuffleList(args).then((shuffled) => {
        shuffled.map((item, index) => {
          shuffled[index] = `**${index + 1}. **${item}`;
        });
        resolve(shuffled);
      });
    }
  });

commands['!snaps'] = discordObject =>
  new Promise((resolve, reject) => {
    if (discordObject.args === undefined) {
      reject('I hate empty queries.');
    } else {    
      const args = utilities.argumentSplit(discordObject.args.toUpperCase())

      if (args.length < 3) {
        reject('Missing an argument. Please check your query. `!snaps team, pos, week, year`');
      }
      // select current year as default year argument
      if (args.length === 3) {
        args.push(`2019`)
      }
      const validPos = ['RB', 'WR', 'TE'];
      const validWeek = [
        'ALL',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
      ];
      const validYear = ['2012','2013','2014','2015', '2016', '2017', '2018', '2019']
      const validTeams = teamLookup.map(obj => obj.abbreviation);
      const validTeamNames = teamLookup.map(obj => obj.mascot.toLowerCase());
      let team = '', pos = '', week = '', year = '';
      // check for valid week number
      args.map((item) => {
        const test1 = validTeams.includes(item);
        const test2 = validPos.includes(item);
        const test3 = validWeek.includes(item);
        const test4 = validYear.includes(item);
        const test5 = validTeamNames.includes(item.toLowerCase());
        if (test1) {
          team = item;
        }
        if (test2) {
          pos = item;
        }
        if (test3) {
          week = item;
        }
        if (test4) {
          year = item;
        }
        if (test5) {
          teamLookup.map((obj) => {
            if (obj.mascot.toLowerCase() === item.toLowerCase()) {
              team = obj.abbreviation;
            }
          });
        }
      });
      let teamname,
        teamlogo;
      teamLookup.map((obj) => {
        if (obj.abbreviation === team) {
          teamname = obj.name;
          teamlogo = obj.logo;
        }
      });
      // if any of the argument is empty, that means one or more of the arguments isn't valid
      if (!team || !week || !pos || !year) {
        if (!team) {
          reject('Invalid team symbol entered.');
        }
        if (!week) {
          reject('Invalid week entered.');
        }
        if (!pos) {
          reject('Invalid position entered.');
        }
        if (!year) {
          reject('Invalid year entered. No data available yet for the year selected.');
        }
      } else {
        snapcounts
          .getSnapcounts(team, pos, week, year)
          .then((array) => {
            const embed = {
              embed: {
                title: `${teamname} ${year}`,
                description: `${utilities.returnSnapcountStrings(pos, week, array)}`,
                color: 11913417,
                thumbnail: { url: teamlogo },
              },
            };
            const string = utilities.returnSnapcountStrings(pos, week, array);
            resolve(embed);
          })
          .catch((err) => {
            reject(err);
          });
      }
    }
  });

module.exports = commands;
