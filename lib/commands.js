const utilities = require('./utilities.js');
const rotoworld = require('./rotoworld.js');
const espn = require('./espn.js');
const stats = require('./teamstats.js');
const TubaStatNode = require('./tubastats.js');
const lib4for4 = require('./4for4.js');
const depthChart = require('./depthchart.js');
const teamLookup = require('../stats/nflteamsdata.json');
const tubaStatsData = require('../stats/nfl_team_stats.json');
const polly = require('./polly.js');
const boris = require('./borischen.js');
const Discord = require('discord.js');
const snapcounts = require('./snapcounts.js');
const _get = require('./_get.js');
var year = '2018';
const commands = {};

commands['%adp'] = nameObject => new Promise((resolve, reject) => {
  const name = nameObject.args;

  lib4for4.getADP(name).then((resultObject) => {
    let returnString = `ADP as of ${resultObject.LastUpdated} via 4for4 for `;
    returnString += `${resultObject.name}: `;
    returnString += `ESPN: ${resultObject.ADP.ESPN} (${utilities.convertToPickPosition(resultObject.ADP.ESPN)})`;
    returnString += `, MFL: ${resultObject.ADP.MFL} (${utilities.convertToPickPosition(resultObject.ADP.MFL)})`;
    returnString += `, NFL: ${resultObject.ADP.NFL} (${utilities.convertToPickPosition(resultObject.ADP.NFL)})`;
    returnString += `, Yahoo: ${resultObject.ADP.Yahoo} (${utilities.convertToPickPosition(resultObject.ADP.Yahoo)})`;
    resolve(returnString);
  }).catch((error) => {
    reject(error);
  });
});

commands['%choose'] = argsObject => new Promise((resolve, reject) => {
  const args = argsObject.args;

  if (!args) {
    reject('I need things to choose from!');
  } else {
    resolve(utilities.chooseOne(args));
  }
});

commands['%next5'] = teamObject => new Promise((resolve, reject) => {
  const team = teamObject.args;

  espn.next5(team).then((results) => {
    const scheduleString = results.schedule.map((game) => {
      const gameDayDisplay = !['Sunday', ''].includes(game.gameDay) ? `(${game.gameDay})` : '';
      return `${game.weekNumber}. ${game.location}${game.opponent.mascot} ${game.gameTime} ${gameDayDisplay}`;
    }).join('\r\n');

    const embed = new Discord.RichEmbed()
      .setTitle(`${results.team.name} Remaining Schedule`)
      .setThumbnail(results.team.logo)
      .setDescription(scheduleString);

    resolve({
      embed
    });
  }).catch((error) => {
    reject(error);
  });
});

commands['%next'] = teamObject => new Promise((resolve, reject) => {
  const team = teamObject.args;
  espn.nextGame(team).then((results) => {
    const scheduleString = results.schedule.map((game) => {
      const gameDayDisplay = !['Sunday', ''].includes(game.gameDay) ? `(${game.gameDay})` : '';
      return `**${game.location}${game.opponent.abbreviation} ${game.gameTime} ${gameDayDisplay}**`;
    }).join('\r\n');
    resolve(`${scheduleString}`);
  }).catch((error) => {
    reject(error);
  });
});

commands['%schedule'] = teamObject => new Promise((resolve, reject) => {
  const team = teamObject.args;

  espn.remainingGames(team).then((results) => {
    const scheduleString = results.schedule.map((game) => {
      const gameDayDisplay = !['Sunday', ''].includes(game.gameDay) ? `(${game.gameDay})` : '';
      return `${game.weekNumber}. ${game.location}${game.opponent.mascot} ${game.gameTime} ${gameDayDisplay}`;
    }).join('\r\n');

    const embed = new Discord.RichEmbed()
      .setTitle(`${results.team.name} Remaining Schedule`)
      .setThumbnail(results.team.logo)
      .setDescription(scheduleString);

    resolve({
      embed
    });
  }).catch((error) => {
    reject(error);
  });
});

commands['%roto'] = nameObject => new Promise((resolve, reject) => {
  const name = nameObject.args;

  if (name === '') {
    reject('I need a name to lookup!');
  } else {
    nameObject.message.react('⌛').then(()=>{
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
            fields: [{
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
        my_react = nameObject.message.reactions.filter((reaction) => {
          if (reaction.me == true) {
            console.log("{{ " + reaction.name)
            return reaction
          }
        }).remove(nameObject.botuser).then(function () {
          nameObject.message.react("👍")
        }).catch(function () {
          nameObject.message.react("✖")
        });
        resolve(embedToSend);

      }).catch((error) => {
        console.log("err:  " + error);
        my_react = nameObject.message.reactions.filter((reaction) => {
          if (reaction.me == true) {
            console.log("{{ " + reaction.name)
            return reaction
          }
        }).remove(nameObject.botuser).then(function () {
          nameObject.message.react("👎")
        }).catch(function () {
          nameObject.message.react("✖")
        });
        reject(error);
      });
    })
    
  }
});

commands['%teamstats'] = teamStatsObject => new Promise((resolve, reject) => {
  const input = teamStatsObject.args.toLowerCase();
  const valid = teamLookup.filter((obj) => {
    if (obj.abbreviation.toLowerCase() === input || obj.mascot.toLowerCase() === input) {
      return obj
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
        fields: [{
            name: 'Total offensive plays',
            value: `${object.offensivePlay}`
          },
          {
            name: 'Pass / Rush Ratio',
            value: `${object.passRushRatio}`
          },
          {
            name: 'Passing yards attempted',
            value: `${object.passingYards}`,
            inline: true
          },
          {
            name: 'Yards per passing attempt',
            value: `${object.yardsPerPass}`,
            inline: true
          },
          {
            name: 'Short passes',
            value: `${object.shortPass}`,
            inline: true
          },
          {
            name: 'Deep passes',
            value: `${object.deepPass}`,
            inline: true
          },
          {
            name: 'Total rushing yards',
            value: `${object.rushingYards}`,
            inline: true
          },
          {
            name: 'Yards per rushing attempt',
            value: `${object.yardsPerRush}`,
            inline: true
          },
        ],
      },
    };
    resolve(embed);
  }
});

commands['%tubastats'] = (teamStatsObject) => new Promise((resolve, reject) => {
  try {
    const user_arguments = teamStatsObject.args.toLowerCase();
    let target_team, target_year;
    user_arguments_list = user_arguments.split(',');
    if (user_arguments_list.length == 2) {
      target_team = user_arguments_list[0];
      target_year = user_arguments_list[1].trim();
    } else if ((user_arguments_list.length == 2 && user_arguments_list[1] != '') || user_arguments_list.length == 1) {
      target_team = user_arguments_list[0];
      target_year = new Date().getFullYear()-1;
    } else {
      reject('Invalid request. Missing one required argument <FirstName LastName> or <WeekNumber>.');
    }

    let valid_team = teamLookup.filter((obj) => {
      if (obj.abbreviation.toLowerCase() === target_team || obj.mascot.toLowerCase() === target_team) {
        return obj
      }
    });
    let embed_fields = [];

    if (target_team === '') {
      reject('I need a team symbol.');
    } else if (target_team.length === 0) {
      reject('Invalid team symbol or mascot.');
    } else if (!valid_team) {
      reject('I did not understand the team [- ' + target_team + " -].  Please use a valid mascot or abbreviation");
    } else if (Object.keys(tubaStatsData).indexOf(target_year.toString()) < 0) {
      reject('Sorry, I only have data for the following years  [- ' + Object.keys(tubaStatsData).join(' - ') + ' -].  You entered [- ' +target_year+ " -]");
    } else {
      valid_team = valid_team[0];
      const teamname = valid_team.name;
      const teamlogo = valid_team.logo;
      const target_year_data = tubaStatsData[target_year];

      if (Object.keys(target_year_data).indexOf(teamname) > -1) {
        const statnode = new TubaStatNode(target_year_data[teamname]);
        let average_data = null;
        if (Object.keys(target_year_data).indexOf("Average") > -1) {
          average_data = new TubaStatNode(target_year_data["Average"]);
        }


        let total_plays_str = '';
        let completions_pct = ((statnode.completions / statnode.passAttempts) * 100).toFixed(2);
        let avg_completions_pct = ((average_data.completions / average_data.passAttempts) * 100).toFixed(2);
        // let total_plays_str = average_data ? '· (League Avg: ' + average_data.totalPlays + ')' : '';
        // let average_rush_str = average_data ? '· ' + (statnode.rushPercent - average_data.rushPercent).toFixed(2) + '%' : '';
        // let average_pass_str = average_data ? '· ' + (statnode.passPercent - average_data.passPercent).toFixed(2) + '%' : '';
        // let completions_pct = statnode.completions / statnode.passAttempts
        // let average_completions_str = average_data ? '· ' + (completions_pct - (average_data.completions - average_data.passAttempts)).toFixed(2) + '%' : '';
        // let average_sack_str = average_data ? '· ' + (statnode.sackPercent - average_data.sackPercent).toFixed(2) + '%' : '';

        let sorted_targets = statnode.getSortedTargets(average_data)
        let sorted_receptions = statnode.getSortedReceptions(average_data)

        /*
        START HERE
        make string of the sorted receptions with avg if it exitsts
        */
        let target_str = ""
        sorted_targets.forEach((item, index) => {
          target_str += "- " + item.position.toUpperCase() + ": " + item.targetPct + "%  / " + item.targets + " targets - (" + average_data[item.position + 'TargetPercent'] + "%  / " + average_data[item.position + 'Targets'] + ")\n";
        });
        let receptions_str = ""
        sorted_receptions.forEach((item, index) => {
          average_reception_node = average_data[item.position + 'Rec']
          receptions_str += "- " + item.position.toUpperCase() + ": " + item.receptions + " receptions - (" + average_reception_node + " receptions)\n";
        });

        embed_fields = [{
            name: `Total Plays: ${statnode.totalPlays} - (${average_data.totalPlays})`,
            value: `
- Rush: ${statnode.rushAttempts} att / ${statnode.rushPercent}% - (${average_data.rushAttempts} / ${average_data.rushPercent}%)
- Pass: ${statnode.passAttempts} att / ${statnode.passPercent}% - (${average_data.passAttempts} / ${average_data.passPercent}%)
- - Completions: ${statnode.completions} / ${completions_pct}% - (${average_data.completions} / ${avg_completions_pct}%)
- - Sacks: ${statnode.sacks}  (${statnode.sackPercent}%) - (${average_data.sacks} / ${average_data.sackPercent}%)
            `,
            inline: false
          },
          {
            name: `Target Distribution`,
            value: `${target_str}`,
            inline: false
          },
          {
            name: `Total Receptions`,
            value: `${receptions_str}`,
            inline: false
          }
        ];

      } else {
        reject('**Error** - I could not find team stats for this year');
      }

      const embed = {
        embed: {
          title: `${teamname}`,
          description: `${target_year} Offensive stats - (League average)`,
          color: 11913417,
          thumbnail: {
            url: teamlogo,
          },
          fields: embed_fields
        },
      };
      resolve(embed);
    }
  } catch (error) {
    console.log(error);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }
  
});


commands['%teamtargets'] = object => new Promise((resolve, reject) => {
  const args = object.args.split(',');
  if (args.length !== 2) {
    reject('***Invalid query.\nMissing team and/or target type.***\n*Target types are: (total, deep, short, mid, left, right)*');
  }
  const validFormat = ['total', 'deep', 'short', 'mid', 'left', 'right'];
  let teamArg = args[0].replace(/\s/g, '').toLowerCase();
  let type = args[1].replace(/\s/g, '').toLowerCase();;
  if (validFormat.includes(teamArg)) {
    let temp = type
    type = teamArg;
    teamArg = temp;
  }
  const valid = teamLookup.filter((obj) => {
    if (obj.abbreviation.toLowerCase() === teamArg || obj.mascot.toLowerCase() === teamArg) {
      return obj
    }
  });
  if (!validFormat.includes(type)) {
    reject('***Invalid target type.***\n*Target types are: (total, deep, short, mid, left, right)*');
  }
  if (valid.length === 0) {
    reject('Invalid team symbol/mascot.');
  } else {
    const team = valid[0].abbreviation;
    const teamStats = `\`\`\`${stats.getTargets(team, type)}\`\`\``;
    resolve(`**${valid[0].name} ${year}'s ${type} targets**\n(Penalties and interception targets are excluded)${teamStats}`);
  }
});


commands['%help'] = () => new Promise((resolve) => {
  const embed = new Discord.RichEmbed()
    .setColor('#2D57CF')
    .setTitle('Help Command')
    .addField('`%stats <FirstName LastName>, [year]`', 'This returns the statistics for a specific player over the course of the specified season.')
    .addField('`%gamestats <FirstName LastName>, <Year>, <WeekNumber>`', 'This would return the statistics listed for a specified player in the given week. (Essentially the same as stats but would like separate to avoid confusion)')
    .addField('`%projections <FirstName LastName>, <WeekNumber>, [year]`', 'Shows the projections for a specific player during the specified week according to Sleeper.')
    .addField('`%adp <FirstName LastName>`', 'This returns the ADP for the major Fantasy Football sites according to the most recent data on 4for4, only up to the Top 250.')
    .addField('`%depthchart <team mascot>, <qb/wr/te/rb>`', 'This returns the depth chart for a team\'s position from CBS Football.')
    .addField('`%teamstats <team mascot>`', 'Shows major stats for the previous season of a team.')
    .addField('`%teamtargets <team mascot>, <total/short/deep/left/right>`', 'Shows statistics for all receivers with greater than or equal to 7% of teams\' type targets on a given team.')
    .addField('`%snaps <team mascot>, <wr/rb/te/qb>, <week>`', 'Shows snap percentages of given teams positions for a specified week.')
    .addField('`%roto <FirstName LastName>`', 'Shows latest Rotoworld blurb about a specified player.')
    .addField('`%schedule <team mascot>`', 'This displays the schedule for the specified team.')
    .addField('`%next5 <team mascot>`', 'Displays the next 5 games for a specified team.')
    .addField('`%wdis <wr/qb/rb/te/flex>, <half/full/std>, <Player1>, <Player2>, etc..`', 'This returns the optimal player to start based on Boris Chen’s most recent tier chart.')
    .addField('`%choose <OptionA>, <OptionB>, etc..`', 'This makes a random decision for you.')
    .addField('`%snaps <team/mascot>, <pos>, <week>`', 'Shows offensive snap percentages of team at chosen position.')
    .addField('`%teamstats <team> <symbol/mascot>`', 'Shows major stats for the previous season of a team.')
    .addField('`%teamtargets <team> <symbol/mascot>, <pass type>`', 'Shows statistics for all receivers with greater than or equal to 7% of teams\' type targets on a given team.')
    .setThumbnail('http://i.imgur.com/XMqc3C1.png');

  resolve({
    embed
  });
});

commands['%projections'] = projectionsObject => new Promise((resolve, reject) => {
  try {
    const string = projectionsObject.args;
    var local_year = null;
    var local_week = null;

    const arg = string.split(',');
    if (arg.length > 2) {
      var local_year = arg[2];
      var local_week = arg[1];
    } else if (arg.length == 2 && arg[1] != '') {
      var local_year = year;
      var local_week = arg[1];
    } else {
      reject('Invalid request. Missing one required argument <FirstName LastName> or <WeekNumber>.');
    }

    var local_name = arg[0];

    _get.id(local_name, (result) => {
      _get.projections(result, local_week, local_year, (data) => {
        let desc = '';

        embed = new Discord.RichEmbed()
          .setColor('#2D57CF')
          .setTitle(`Projections Command [Year ${local_year.replace(' ', '')}, Week ${local_week.replace(' ', '')}]`);

        if (Object.keys(data).length > 0) {
          for (var i in utilities.list_order) {
            let value = utilities.list_order[i];
            if (!utilities.notinclude_projections.includes(value)) {
              if (value in data) {
                if (value in utilities.convert_stats) {
                  desc += `${utilities.convert_stats[value]} ► ${data[value]}\n`;
                } else {
                  desc += `${value} ► ${data[value]}\n`;
                }
              }
            }
          }

          for (var value in data) {
            if (!utilities.list_order.includes(value) && !utilities.notinclude_projections.includes(value)) {
              if (value in utilities.convert_stats) {
                desc += `${utilities.convert_stats[value]} ► ${data[value]}\n`;
              } else {
                desc += `${value} ► ${data[value]}\n`;
              }
            }
          }

          embed = embed.setDescription(desc);
          resolve({
            embed
          });
        } else {
          resolve(`No results for "${local_name}" (${local_year.replace(' ', '')}, ${local_week.replace(' ', '')})`);
        }
      });
    });
  } catch (e) {
    console.log('pass');
    console.log(e);
  }
});

commands['%gamestats'] = gamestatsObject => new Promise((resolve, reject) => {
  try {
    const string = gamestatsObject.args;
    var local_year = null;
    var local_week = null;

    const arg = string.split(',');
    if (arg.length > 2) {
      var local_year = arg[1];
      var local_week = arg[2];
    } else if (arg.length == 2 && arg[1] != '') {
      var local_year = year;
      var local_week = '1';
    } else {
      reject('Invalid request. Missing required argument <FirstName LastName>.');
    }

    var local_name = arg[0];

    _get.id(local_name, (result) => {
      _get.gamestats(result, local_year, local_week, (data) => {
        let desc = '';

        embed = new Discord.RichEmbed()
          .setColor('#2D57CF')
          .setTitle(`Gamestats Command [Year ${local_year.replace(' ', '')}, Week ${local_week.replace(' ', '')}]`);

        if (Object.keys(data).length > 0) {
          for (var i in utilities.list_order) {
            let value = utilities.list_order[i];
            if (!utilities.notinclude.includes(value)) {
              if (value in data) {
                if (value in utilities.convert_stats) {
                  desc += `${utilities.convert_stats[value]} ► ${data[value]}\n`;
                } else {
                  desc += `${value} ► ${data[value]}\n`;
                }
              }
            }
          }

          for (var value in data) {
            if (!utilities.list_order.includes(value) && !utilities.notinclude.includes(value)) {
              if (value in utilities.convert_stats) {
                desc += `${utilities.convert_stats[value]} ► ${data[value]}\n`;
              } else {
                desc += `${value} ► ${data[value]}\n`;
              }
            }
          }

          embed = embed.setDescription(desc);
          resolve({
            embed
          });
        } else {
          resolve(`No results for "${local_name}" (${local_year.replace(' ', '')}, ${local_week.replace(' ', '')})`);
        }
      });
    });
  } catch (e) {
    console.log('pass');
    console.log(e);
  }
});

commands['%stats'] = statsObject => new Promise((resolve, reject) => {
  try {
    const string = statsObject.args;
    var local_year = null;

    const arg = string.split(',');
    if (arg.length > 1) {
      var local_year = arg[1];
    } else if (arg.length == 1 && arg[0] != '') {
      var local_year = year;
    } else {
      reject('Invalid request. Missing required argument <FirstName LastName>.');
    }

    let local_name = arg[0];

    _get.id(local_name, (result) => {
      _get.stats(result, local_year, (data) => {
        let desc = '';

        embed = new Discord.RichEmbed()
          .setColor('#2D57CF')
          .setTitle(`Stats Command [${local_year.replace(' ', '')}]`);

        if (Object.keys(data).length > 0) {
          for (var i in utilities.list_order) {
            let value = utilities.list_order[i];
            if (!utilities.notinclude_stats.includes(value)) {
              if (value in data) {
                if (value in utilities.convert_stats) {
                  desc += `${utilities.convert_stats[value]} ► ${data[value]}\n`;
                } else {
                  desc += `${value} ► ${data[value]}\n`;
                }
              }
            }
          }

          for (var value in data) {
            if (!utilities.list_order.includes(value) && !utilities.notinclude_stats.includes(value)) {
              if (value in utilities.convert_stats) {
                desc += `${utilities.convert_stats[value]} ► ${data[value]}\n`;
              } else {
                desc += `${value} ► ${data[value]}\n`;
              }
            }
          }

          embed = embed.setDescription(desc);
          resolve({
            embed
          });
        } else {
          resolve(`No results for "${local_name}" (${local_year.replace(' ', '')})`);
        }
      });
    });
  } catch (e) {
    console.log('pass');
    console.log(e);
  }
});

commands['%depthchart'] = (depthChartObject) => {
  const string = depthChartObject.args;

  const arg = string.split(',');
  return new Promise((resolve, reject) => {
    if (arg.length < 2) {
      reject('Invalid request. Missing team symbol and/or team position.');
    } else {
      let team = arg[0].toLowerCase().replace(/\s/g, '');
      let position = arg[1].toLowerCase().replace(/\s/g, '');
      const validPosition = ['qb', 'rb', 'fb', 'wr', 'te', 'kr', 'pr', 'k', 'lt', 'lg', 'c', 'rg', 'rt', 'ldt', 'lde', 'ndt', 'rdt',
        'rde', 'mlb', 'slb', 'wlb', 'rcb', 'lcb', 'ss', 'fs', 'p', 'ls', 'h'
      ];
      // check to see if teamname and position was confused, if true, swap

      if (validPosition.includes(team.toLowerCase())) {
        let temp = team;
        team = position;
        position = temp;
      }
      const valid = teamLookup.filter((obj) => {
        if (obj.abbreviation.toLowerCase() === team || obj.mascot.toLowerCase() === team) {
          return obj
        }
      });

      if (valid.length === 0) {
        resolve('Invalid team symbol/mascot. Please check your query.');
      }
      if (!validPosition.includes(position)) {
        resolve('Invalid position. Please check your query.');
      } else {
        depthChart.getRoster(valid[0].abbreviation, position).then((object) => {
          const embed = {
            embed: {
              title: `${object.teamname}`,
              description: `${utilities.returnDepthChartStrings(position, object.roster[position], object.roster.update)}`,
              url: object.url,
              color: 11913417,
              thumbnail: {
                url: object.logo
              },
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


commands['%boris'] = (borisObject) => {
  const string = borisObject.args;

  let args = string.toLowerCase().replace(/\s/g, '').split(',');
  return new Promise((resolve, reject) => {
    const noFormat = ['qb', 'k', 'dst'];
    const validPosition = ['qb', 'rb', 'te', 'wr', 'k', 'dst', 'flex'];
    const validFormat = ['standard', 'half', 'full'];
    let position = args[0].trim('').toLowerCase();
    let scoring;
    if (args.length <= 1) {
      scoring = 'standard'
    } else {
      scoring = args[1].trim('').toLowerCase();
    }
    // check if position and scoring format was a typo, swap if it was a mistake

    if (validPosition.includes(scoring)) {
      let temp = position;
      position = scoring;
      scoring = temp;
      args = [position, scoring]
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
      reject('Invalid position/format.\nValid positions are ***qb, rb, wr, te, k , dst***.\nValid scoring formats are ***standard, half, full***');
    } else {
      scoring = args[1].trim('').toLowerCase();
    }
    // if its a position that requires scoring format
    if (!validPosition.includes(position) || !validFormat.includes(scoring)) {
      reject('Invalid position/format.\nValid positions are ***qb, rb, wr, te, k , dst***.\nValid scoring formats are ***standard, half, full***');
    } else {
      boris.getTier(position, scoring).then((object) => {
        const url = object.url;
        const embed = {
          embed: {
            title: `Boris ${position.toUpperCase()} tiers`,
            color: 11913417,
            url,
            thumbnail: {
              url: 'https://s3-us-west-1.amazonaws.com/fftiers/out/weekly-ALL-HALF-PPR-adjust0.png'
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
            inline: false
          });
        });
        resolve(embed);
      }).catch((err) => {
        reject(err);
      });
    }
  });
};


commands['%find'] = findObject => new Promise((resolve, reject) => {
  const findString = findObject.args;

  const results = utilities.findPlayer(findString);
  if (!results) {
    reject('Cannot find player');
  } else {
    resolve(`Fuzzy score: ${results.score}\nPlayer found: ${results.fullname}\nTeam: ${results.team}`);
  }
});


commands['%wdis'] = wdisObject => new Promise((resolve, reject) => {
  const wdisString = wdisObject.args;
  const args = wdisString.split(',');
  if (args.length < 2) {
    reject('Invalid query.\nValid positions are ***qb, rb, te, k, dst, flex.***\nValid scoring are ***standard, half, full.***');
  }
  const noFormat = ['qb', 'k', 'dst'];
  const validPosition = ['qb', 'rb', 'te', 'wr', 'k', 'dst', 'flex'];
  const validFormat = ['standard', 'half', 'full'];
  let position = args[0].replace(/\s/g, '').toLowerCase();
  let format = args[1].replace(/\s/g, '').toLowerCase();;
  let players;
  // if args is less than 2, that means its an invalid query
  // check if arguments are backward, if so swap it
  if (validPosition.includes(format)) {
    let temp = format;
    format = position;
    position = temp;
  }

  // check if the position argument is valid
  if (!validPosition.includes(position)) {
    reject('You might be missing a comma or spelled the position wrong. \nValid positions are ***qb, rb, te, k, dst, flex.***');
  }
  // check if the scoring format argument is valid
  if (!validFormat.indexOf(format > -1)) {
    reject('You are missing a comma, scoring format, or spelled the scoring format wrong. ***\nValid scoring are ***standard, half, full.***');
  }

  // if position given are qb, dst, or kicker, we shouldn't require the scoring format
  // we'll just give it a standard format
  if (noFormat.includes(position)) {
    format = 'standard';
  }
  // check if dst is queried
  if (position === 'dst') {
    players = args.slice(1, args.length).map(n => n.trim('').toLowerCase()).filter(n => ['dst', 'standard', 'half', 'full'].indexOf(n) < 0).filter(n => n);
    players.forEach((item) => {
      const team = teamLookup.filter((obj) => {
        if (obj.abbreviation.toLowerCase() === item || obj.mascot.toLowerCase() === item || obj.name.toLowerCase() === item) {
          return obj
        }
      });
      if (team.length === 0) {
        reject('Invalid team symbol/name. Please double check the team symbol/name.');
      } else {
        //get index number of item in players
        let index = players.indexOf(item);
        players[index] = team[0].name.toLowerCase();
      }
    });
  } else if (noFormat.includes(position)) {
    players = args.slice(1, args.length).map(n => n.trim('').toLowerCase()).filter(n => ['k', 'qb', 'standard', 'half', 'full'].indexOf(n) < 0).filter(n => n);
    players.forEach((player) => {
      const matched = utilities.findPlayer(player);
      if (!matched) {
        reject('One of these player doesn\'t exist in the players database. Please use the player\'s full name.');
      }
    });
  } else {
    players = args.slice(2, args.length).map(item => item.trim('').toLowerCase()).filter(n => ['qb', 'rb', 'wr', 'te', 'k', 'dst', 'standard', 'half', 'full'].indexOf(n) < 0).filter(n => n).filter(n => n);
    // check to see if player exist
    players.forEach((player) => {
      const matched = utilities.findPlayer(player);
      if (!matched) {
        reject('One of these player doesn\'t exist in the players database. Please use the player\'s full name.');
      }
    });
  }
  // check if scoring format is required
  if (!noFormat.includes(position) && !validFormat.includes(format)) {
    reject('Missing scoring format and/or comma.\nValid format are ***standard, half,*** or ***full.***');
  }
  // check for valid position
  if (!validPosition.includes(position)) {
    reject('Invalid position entered.\nValid positions are ***qb, rb, wr, te, k, dst, flex***');
  }
  // check if user gave 0 players to rank from
  if (players.length < 1) {
    reject('Please give me players to rank from!');
  }
  // check to see if the players exist in the players file, and reject
  // if the position is wrong for one of the valid players
  if (position !== 'flex') {
    for (let i = 0; i < players.length; i += 1) {
      const matched = utilities.findPlayer(players[i]);
      if (matched && matched.position !== position) {
        reject('One or more players doesn\'t match the position they play in.');
      }
    }
  }
  // if given only one valid player
  if (players.length === 1) {
    resolve(`Just start ${players[0].trim().split(' ').map(item => item[0].toUpperCase() + item.slice(1, item.length)).join(' ')}.`);
    // if user query a tean instead of player names
  } else {
    boris.getTier(position, format).then((object) => {
      const response = utilities.rankPlayers(object, players, position);
      let message;
      if (response.includes(',') || response.includes(' and ')) {
        message = `Boris says: **${response}** are in the same tier level. Flip a coin or go with your gut.`;
      } else {
        message = `Boris says: "Start **${response}**."`;
      }
      resolve(message);
    }).catch((err) => {
      reject(err);
    });
  }
});

commands['%shuffle'] = argsObject => new Promise((resolve, reject) => {
  const args = argsObject.args;
  if (!args) {
    reject('I need at least two items to shuffle!');
  } else {
    utilities.shuffleList(args).then(shuffled => {
      shuffled.map((item, index) => {
        shuffled[index] = '**' + (index + 1) + '. **' + item;
      });
      resolve(shuffled)
    });
  }
});


commands['%snaps'] = discordObject => new Promise((resolve, reject) => {
  if (discordObject.args === undefined) {
    reject('I hate empty queries.');
  } else {
    const string = discordObject.args;
    const args = string.toUpperCase().replace(/\s/g, '').split(',').filter(n => {
      return /\S/.test(n)
    });
    let flag = false;
    if (args.length < 3) {
      reject('Missing an argument. Please check your query. `!snaps team, pos, week`');
    }
    const validPos = ['RB', 'WR', 'TE'];
    const validWeek = ['ALL', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
    const validTeams = teamLookup.map((obj) => obj.abbreviation);
    const validTeamNames = teamLookup.map((obj) => obj.mascot.toLowerCase());
    let team = '',
      pos = '',
      week = '';
    // check for valid week number
    args.map(item => {
      let test1 = validTeams.includes(item);
      let test2 = validPos.includes(item);
      let test3 = validWeek.includes(item);
      let test4 = validTeamNames.includes(item.toLowerCase());
      if (test1) {
        team = item
      };
      if (test2) {
        pos = item
      };
      if (test3) {
        week = item
      };
      if (test4) {
        teamLookup.map(obj => {
          if (obj.mascot.toLowerCase() === item.toLowerCase()) {
            team = obj.abbreviation;
          }
        });
      };
    });
    let teamname, teamlogo;
    teamLookup.map(obj => {
      if (obj.abbreviation === team) {
        teamname = obj.name;
        teamlogo = obj.logo;
      }
    });
    // if any of the argument is empty, that means one or more of the arguments isn't valid
    if (!team || !week || !pos) {
      if (!team) {
        reject('Invalid team symbol entered.');
      }
      if (!week) {
        reject('Invalid week entered.');
      }
      if (!pos) {
        reject('Invalid position entered.')
      }
    } else {
      snapcounts.getSnapcounts(team, pos, week).then((array) => {
        const embed = {
          embed: {
            title: `${teamname} ${year}`,
            description: `${ utilities.returnSnapcountStrings(pos, week, array)}`,
            color: 11913417,
            thumbnail: {
              url: teamlogo
            },
          },
        };
        let string = utilities.returnSnapcountStrings(pos, week, array)
        resolve(embed);
      }).catch((err) => {
        reject(err);
      });
    }

  }

});



module.exports = commands;
