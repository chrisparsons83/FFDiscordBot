const teamStats = require('../stats/teamstats.json');
const leagueStats = require('../stats/leagueAverage.json');

const tools = {};

// return percentage
const getPercent = (num1, num2) => parseFloat(((num1 / num2) * 100).toFixed(1));
const getAvg = (num1, num2) => (num1 / num2).toFixed(2);

const getStats = (stats, league) => {
  const leaguePlays = league.totalOffensivePlay;
  const leaguePass = league.totalPassingPlay;
  const leagueRush = league.totalRushingPlay;
  const leaguePassYds = league.totalPassingYards;
  const leagueRushYds = league.totalRushingYards;
  const leagueShortPass = league.shortPass;
  const leagueDeepPass = league.deepPass;
  const total = stats.totalOffensivePlay;
  const pass = stats.totalPassingPlay;
  const rush = stats.totalRushingPlay;
  const passYds = stats.totalPassingYards;
  const rushYds = stats.totalRushingYards;
  const short = stats.shortLeft + stats.shortMiddle + stats.shortRight;
  const deep = stats.deepLeft + stats.deepMiddle + stats.deepRight;
  const leaguePlayAverage = (leaguePlays / 32).toFixed(0);
  const leaguePassPercentage = getPercent(leaguePass, leaguePlays);
  const leagueRushPercentage = getPercent(leagueRush, leaguePlays);
  const object = {};
  object.offensivePlay = `**${total}** plays (${leaguePlayAverage})`;
  object.passingPercentage = `${getPercent(pass, total)}%`;
  object.passingYards = `**${passYds} yds** (${(leaguePassYds / 32).toFixed(0)} yds)`;
  object.yardsPerPass = `**${getAvg(passYds, pass)} yds** per att (${getAvg(leaguePassYds, leaguePass)})`;
  object.shortPass = `**${getPercent(short, pass)}%** (${getPercent(leagueShortPass, leaguePass)}%)`;
  object.deepPass = `**${getPercent(deep, pass)}%** (${getPercent(leagueDeepPass, leaguePass)}%)`;
  object.rushingPercentage = `${getPercent(rush, total)}%`;
  object.rushingYards = `**${rushYds} yds** (${(leagueRushYds / 32).toFixed(0)} yds)`;
  object.yardsPerRush = `**${getAvg(rushYds, rush)} yds** per att (${(leagueRushYds / leagueRush).toFixed(2)})`;
  object.passRushRatio = `**${object.passingPercentage}** / **${object.rushingPercentage}** (${leaguePassPercentage}% / ${leagueRushPercentage}%)`;
  return object;
};

const getTargets = (stat,type) => {
  let message = '';
  // turn object into array to be sortable, then sort by total targets
  const arr = [];
  Object.keys(stat.targets).forEach((key) => {
    arr.push([key, stat.targets[key][type]]);
    return true;
  });
  arr.sort((a, b) => b[1] - a[1]);
  // there is a message length limit, seems like the limits is for 8 players current
  for (let i = 0; i < arr.length; i += 1) {
    const key = arr[i][0];
    const firstInitial = capitalize(arr[i][0].substring(0, arr[i][0].indexOf('.') + 1).toLowerCase())
    let lastName = capitalize(arr[i][0].substring(arr[i][0].indexOf('.') + 1, arr[i][0].length).toLowerCase());
    lastName = lastName[0] + lastName.substring(1, lastName.length);
    let name = `${firstInitial} ${lastName}`;
    const playerTotal = stat.targets[key][type]
    let teamTotal;
    if (type === 'total') {
      teamTotal = stat.shortPass + stat.deepPass
    } else {
      teamTotal = stat[type]
    }
    const cutoff = getPercent(playerTotal, teamTotal);
    if (cutoff >= 5) {
      message += `\n${name}: ${playerTotal} (${getPercent(playerTotal, teamTotal)}%)`;
    } else {
      break;
    } 
  }
  return message;
};


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

tools.getBreakdown = (symbol) => {
  const stat = teamStats[symbol];
  const embed = getStats(stat, leagueStats);
  return embed;
};

tools.getTargets = (team, type) => {
  const stats = teamStats[team]
  if (type === 'total') {
    return getTargets(stats, type);
  }
  if (type === 'deep') {
    return getTargets(stats, 'deepPass');
  }
  if (type === 'short') {
    return getTargets(stats, 'shortPass');
  }
  if (type === 'left') {
    return getTargets(stats, 'totalLeft');
  }
  if (type === 'mid') {
    return getTargets(stats, 'totalMiddle');
  }
  if (type === 'right') {
    return getTargets(stats, 'totalRight');
  }  
};


module.exports = tools;
