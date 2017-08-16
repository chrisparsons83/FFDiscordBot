const teamStats = require(__dirname + '/../stats/teamstats.json');
const leagueStats = require(__dirname + '/../stats/leagueAverage.json');
const teamLookup = require(__dirname + '/../stats/teamLookup.json');
const tools = {};
//return number / 32
const leagueAvg = function (num) {
  return (num / 32);
}
// return percentage
const getPercent = function (num1, num2) {
  return (num1/num2*100).toFixed(2)
}
const getAvg = function(num1, num2) {
  return (num1/num2).toFixed(2);
}
const getStats = function(team, symbol, stats, league) {
    let leaguePlays = league.totalOffensivePlay;
    let leaguePass = league.totalPassingPlay;
    let leagueRush = league.totalRushingPlay;
    let leaguePassYds = league.totalPassingYards;
    let leagueRushYds = league.totalRushingYards;
    let leagueShortPass = league.shortPass;
    let leagueDeepPass = league.deepPass;
  
    let total = stats.totalOffensivePlay;
    let pass = stats.totalPassingPlay;
    let rush = stats.totalRushingPlay;
    let passYds = stats.totalPassingYards;
    let rushYds = stats.totalRushingYards;
    let short = stats.shortPass;
    let deep = stats.deepPass;
    return {
      "embed": {
        "title": `${team}`,
        "description": "2016 Offensive stats",
        "color": 11913417,
        "thumbnail": {
          "url": teamLookup[symbol].logo,
        },
        "fields": [
          {
            "name": "Total offensive play", "value": total, "inline": true 
          },
          {
            "name": "League average", "value": (leaguePlays/32).toFixed(2), "inline": true 
          },      
          {
            "name": "Total pass play", "value": `${getPercent(pass, total)}%`, "inline": true
          },
          {
            "name": "League average", "value": `${getPercent(leaguePass, total)}%`, "inline": true
          },
          {
            "name": "Rush play", "value": `${getPercent(rush, total)}%`, "inline": true
          },
          {
            "name": "League average", "value": `${getPercent(leagueRush, leaguePlays)}%`, "inline": true
          }, 
          {
            "name": "Attempted passing yards", "value": `${passYds} yds`, "inline": true
          },
          {
            "name": "League average", "value": `${(leaguePassYds/32).toFixed(2)} yds`, "inline": true
          }, 
          {
            "name": "Average yards per pass att", "value": `${getAvg(passYds, pass)} yds per att`, "inline": true
          },
          {
            "name": "League average", "value": `${getAvg(leaguePassYds, leaguePass)} yds per att`, "inline": true
          }, 
          {
            "name": "Total rushing yds", "value": `${rushYds} yds`, "inline": true
          },
          {
            "name": "League average", "value": `${(leagueRushYds/32).toFixed(2)} yds`, "inline": true
          }, 
          {
            "name": "Avg yds per rush", "value": `${getAvg(rushYds, rush)} yds per att`,  "inline": true
          },
          {
            "name": "League average", "value": `${(leagueRushYds/leagueRush).toFixed(2)}`, "inline": true
          },       
          {
            "name": "Short passes", "value": `${getPercent(short, pass)}%`, "inline": true
          },
          {
            "name": "League average", "value": `${getPercent(leagueShortPass, leaguePass)}%`, "inline": true
          },
          {
            "name": "Deep passes", "value": `${getPercent(deep, pass)}%`, "inline": true
          },
          {
            "name": "League average","value": `${getPercent(leagueDeepPass, leaguePass)}%`, "inline": true
          }     
        ]
      }
    };
}

const getTargets = function(stat) {
  let message ='' ;
  // turn object into array to be sortable, then sort by total targets
  let arr = [];
  let totalTargets = 0;
  for (key in stat.targets) {
    arr.push([key, stat.targets[key]['TOTAL']]);
    totalTargets += stat.targets[key]['TOTAL'];
  }
  arr.sort((a, b) => {
    return b[1] - a[1];
  });
  
  // there is a message length limit, seems like the limits is for 8 players current
  for (let i = 0; i < arr.length; i++) {
    let key = arr[i][0];
    let firstInitial = arr[i][0].substring(0, arr[i][0].indexOf('.')+1);
    let lastName = arr[i][0].substring(arr[i][0].indexOf('.')+1, arr[i][0].length).toLowerCase();
    lastName = lastName[0].toUpperCase() + lastName.substring(1, lastName.length);
    let name = `${firstInitial} ${lastName}`;
    let stats = stat.targets[key];
    let targets = stats['TOTAL'];
    let shortLeft = getPercent(stats['SHORT LEFT'], stats['TOTAL']);
    let shortMid = getPercent(stats['SHORT MIDDLE'], stats['TOTAL']);
    let shortRight = getPercent(stats['SHORT RIGHT'], stats['TOTAL']);
    let deepLeft = getPercent(stats['DEEP LEFT'], stats['TOTAL']);
    let deepMid = getPercent(stats['DEEP MIDDLE'], stats['TOTAL']);
    let deepRight = getPercent(stats['DEEP RIGHT'], stats['TOTAL']);
    let cutoff =  getPercent(targets, totalTargets);
    if (cutoff >= 7) {
      message += `\n\n${name}\nTotal Targets: ${targets}\nPercentage of team's targets: ${getPercent(targets, totalTargets)}%\nShort Left:  ${shortLeft}%\tShort Mid:  ${shortMid}%\tShort Right:  ${shortRight}%\nDeep left:   ${deepLeft}%\t  Deep Mid:  ${deepMid}%\tDeep right:  ${deepRight}%`;
    } else {
      break;
    }    
  }
  return message;
}

tools.getBreakdown = function(teamname, symbol) {
  let stats = teamStats[symbol];
  let embed = getStats(teamname, symbol, stats, leagueStats);
  //console.log(embed)
  return embed;
}

tools.getTargets = function(teamname) {
  let team = teamname.toUpperCase();
  let stats = teamStats[team];
  return getTargets(stats);
}

module.exports = tools;