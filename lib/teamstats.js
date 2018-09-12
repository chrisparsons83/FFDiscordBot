const teamStats = require('../stats/teamstats2018.json');
const leagueStats = require('../stats/leagueAverage2018.json');

const tools = {};

// return percentage
const getPercent = (num1, num2) => parseFloat(((num1 / num2) * 100).toFixed(1));
const getAvg = (num1, num2) => (num1 / num2).toFixed(2);

const getStats = (team, symbol, stats, league) => {
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
  const short = stats.shortPass;
  const deep = stats.deepPass;
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

const getTargets = (stat) => {
  let message = '';
  // turn object into array to be sortable, then sort by total targets
  const arr = [];
  let totalTargets = 0;
  Object.keys(stat.targets).forEach((key) => {
    arr.push([key, stat.targets[key].total]);
    totalTargets += stat.targets[key].total;
    return true;
  });
  arr.sort((a, b) => b[1] - a[1]);
  // there is a message length limit, seems like the limits is for 8 players current
  for (let i = 0; i < arr.length; i += 1) {
    const key = arr[i][0];
    const firstInitial = arr[i][0].substring(0, arr[i][0].indexOf('.') + 1);
    let lastName = arr[i][0].substring(arr[i][0].indexOf('.') + 1, arr[i][0].length).toLowerCase();
    lastName = lastName[0].toUpperCase() + lastName.substring(1, lastName.length);
    let name = `${firstInitial} ${lastName}`;
    if (name === ' D') {
      name = 'De. Thomas';
    }
    const stats = stat.targets[key];
    const targets = stats.total;
    const shortLeft = getPercent(stats['SHORT LEFT'], stats.total);
    const shortMid = getPercent(stats['SHORT MIDDLE'], stats.total);
    const shortRight = getPercent(stats['SHORT RIGHT'], stats.total);
    const deepLeft = getPercent(stats['DEEP LEFT'], stats.total);
    const deepMid = getPercent(stats['DEEP MIDDLE'], stats.total);
    const deepRight = getPercent(stats['DEEP RIGHT'], stats.total);
    const cutoff = getPercent(targets, totalTargets);
    if (cutoff >= 7) {
      message += `\n${name}: ${targets} (${getPercent(targets, totalTargets)}%)`;
    } else {
      break;
    }
  }
  return message;
};

tools.getBreakdown = (teamname, symbol) => {
  const stats = teamStats[symbol];
  const embed = getStats(teamname, symbol, stats, leagueStats);
  return embed;
};

tools.getTargets = (teamname) => {
  const team = teamname.toUpperCase();
  let stats;
  if (team === 'LAR') {
    stats = teamStats['LA'];
  } else {
    stats = teamStats[team]
  }
  return getTargets(stats);
};

module.exports = tools;
