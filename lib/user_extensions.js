const utilities = require('./utilities.js');
const TubaStatNode = require('./tubastats.js');
const teamLookup = require('../stats/nflteamsdata.json');
const tubaStatsData = require('../stats/nfl_team_stats.json');
const Discord = require('discord.js');
const _get = require('./_get.js');


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
--- Completions: ${statnode.completions} / ${completions_pct}% - (${average_data.completions} / ${avg_completions_pct}%)
--- Sacks: ${statnode.sacks}  (${statnode.sackPercent}%) - (${average_data.sacks} / ${average_data.sackPercent}%)
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



module.exports = commands;
