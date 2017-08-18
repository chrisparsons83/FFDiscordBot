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
    let leaguePlayAverage = (leaguePlays/32).toFixed(0);
    let leaguePassPercentage = getPercent(leaguePass, leaguePlays);
    let leagueRushPercentage = getPercent(leagueRush, leaguePlays);
    let object = {}
    object.offensivePlay = `${total} plays (${leaguePlayAverage})`;
    object.passingPercentage = `${getPercent(pass, total)}% (${leaguePassPercentage}%)`;
    object.passingYards = `${passYds} yds (${(leaguePassYds/32).toFixed(0)} yds)`;
    object.yardsPerPass = `${getAvg(passYds, pass)} yds per att (${getAvg(leaguePassYds, leaguePass)})`;
    object.shortPass = `${getPercent(short, pass)}% (${getPercent(leagueShortPass, leaguePass)}%)`;
    object.deepPass = `${getPercent(deep, pass)}% (${getPercent(leagueDeepPass, leaguePass)}%)`;
    object.rushingPercentage = `${getPercent(rush, total)}% (${leagueRushPercentage}%)`;
    object.rushingYards = `${rushYds} yds (${(leagueRushYds/32).toFixed(0)} yds)`;
    object.yardsPerRush = `${getAvg(rushYds, rush)} yds per att (${(leagueRushYds/leagueRush).toFixed(2)})`;
    return object;
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
  return embed;
}

tools.getTargets = function(teamname) {
  let team = teamname.toUpperCase();
  let stats = teamStats[team];
  return getTargets(stats);
}

module.exports = tools;