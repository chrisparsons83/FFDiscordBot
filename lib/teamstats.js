const teamStats = require(__dirname + '/../stats/teamstats.json');
const leagueStats = require(__dirname + '/../stats/leagueAverage.json');
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
const getStats = function(stats, league) {
  // massive long string for discord bot to send
  // it makes the message more structure
  // need a more elegant way to fix this
  let leaguePlays = league.totalOffensivePlay;
  let leaguePass = league.totalPassingPlay;
  let leagueRush = league.totalRushingPlay;
  let leaguePassYards = league.totalPassingYards;
  let leagueRushYards = league.totalRushingYards;
  let leagueShortPass = league.shortPass;
  let leagueDeepPass = league.deepPass;
  let plays = stats.totalOffensivePlay;
  let pass = stats.totalPassingPlay;
  let rush = stats.totalRushingPlay;
  let passYds = stats.totalPassingYards;
  let rushYds = stats.totalRushingYards;
  let short = stats.shortPass;
  let deep = stats.deepPass;
  let leftPass = stats.totalLeft;
  let midPass = stats.totalMiddle;
  let rightPass = stats.totalRight;
  let leftPassYds = stats.totalLeftYards;
  let midPassYds = stats.totalMiddleYards;
  let rightPassYds = stats.totalRightYards;
  let shortLeft = stats.shortLeft;
  let shortLeftYds = stats.shortLeftYards;
  let shortMid = stats.shortMiddle;
  let shortMidYds = stats.shortMiddleYards;
  let shortRight = stats.shortRight;
  let shortRightYds = stats.shortRightYards;
  let deepLeft = stats.deepLeft;
  let deepLeftYds = stats.deepLeftYards;
  let deepMid = stats.deepMiddle;
  let deepMidYds = stats.deepMiddleYards;
  let deepRight = stats.deepRight;
  let deepRightYds = stats.deepRightYards;
  let longString = `\nTotal offensive play: ${plays}\t(League avg:  ${leagueAvg(leaguePlays)})\
  \nPass play: ${getPercent(pass, plays)}%\t\t\t(League avg: ${getPercent(leaguePass, leaguePlays)}%)\
  \nRush play: ${getPercent(rush, plays)}%\t\t\t(League avg: ${getPercent(leagueRush, leaguePlays)}%)\
  \n\nAttempted passing yards: ${passYds} yds\t   (League avg: ${leagueAvg(leaguePassYards)} yds)\
  \nAverage yards per pass att: ${getAvg(passYds, pass)} yds\t(League avg: ${getAvg(leaguePassYards, leaguePass)} yds)\
  \n\nTotal rushing yds: ${rushYds} yds\t(League avg: ${leagueAvg(leagueRushYards)} yds)\
  \nAvg yds per rush: ${getAvg(rushYds, rush)} yds\t (League avg: ${getAvg(leagueRushYards, leagueRush)} yds)\
  \n\nShort passes: ${getPercent(short, pass)}%\t(League avg: ${getPercent(leagueShortPass, leaguePass)}%)\
  \nDeep passes: ${getPercent(deep, pass)}%\t (League avg: ${getPercent(leagueDeepPass, leaguePass)}%)\
  \n\nLeft pass %: ${getPercent(leftPass, pass)} % \t  Mid pass %: ${getPercent(midPass, pass)} %\t  Right pass %: ${getPercent(rightPass, pass)} %\
  \nLeft pass yds: ${leftPassYds} yds\tMid pass yds: ${midPassYds} yds   Right pass yds: ${rightPassYds} yds\
  \nLeft per att: ${getAvg(leftPassYds, leftPass)} yds\t Mid per att: ${getAvg(midPassYds, midPass)} yds   Right per att: ${getAvg(rightPassYds, rightPass)} yds\
  \n\nShort left attempts: ${shortLeft}   Short mid attempts:${shortMid}   Short right attempts: ${shortRight}\
  \nYards per att: ${getAvg(shortLeftYds, shortLeft)} yds\tYards per att: ${getAvg(shortMidYds, shortMid)} yds  Yards per att: ${getAvg(shortRightYds, shortRight)} yds\
  \n\nDeep left attempts: ${deepLeft}\t Deep mid attempts:${deepMid}\t Deep right attempts: ${deepRight}\
  \nYds per att: ${getAvg(deepLeftYds, deepLeft)} yds\t  Yds per att: ${getAvg(deepMidYds, deepMid)} yds   Yds per att: ${getAvg(deepRightYds, deepRight)} yds\
  `;
  return longString;
}

const getTargets = function(stat) {
  let message ='' ;
  // turn object into array to be sortable, then sort by total targets
  let arr = [];
  for (key in stat.targets) {
    arr.push([key, stat.targets[key]['TOTAL']]);
  }
  arr.sort((a, b) => {
    return b[1] - a[1];
  });
  
  // there is a message length limit, seems like the limits is for 8 players current
  for (let i = 0; i < 8; i++) {
    let key = arr[i][0];
    let firstInitial = arr[i][0].substring(0, arr[i][0].indexOf('.')+1);
    let lastName = arr[i][0].substring(arr[i][0].indexOf('.')+1, arr[i][0].length).toLowerCase();
    lastName = lastName[0].toUpperCase() + lastName.substring(1, lastName.length);
    let name = `${firstInitial} ${lastName}`;
    let stats = stat.targets[key];
    let targets = stats['TOTAL'];
    let shortLeft = getPercent(stats['SHORT LEFT'],stats['TOTAL']);
    let shortMid = getPercent(stats['SHORT MIDDLE'],stats['TOTAL']);
    let shortRight = getPercent(stats['SHORT RIGHT'],stats['TOTAL']);
    let deepLeft = getPercent(stats['DEEP LEFT'],stats['TOTAL']);
    let deepMid = getPercent(stats['DEEP MIDDLE'],stats['TOTAL']);
    let deepRight = getPercent(stats['DEEP RIGHT'],stats['TOTAL']);
    message += `\n\n${name}\nTotal Targets(Excluding penalties and ints):  ${targets}\nShort Left:  ${shortLeft}%\tShort Mid:  ${shortMid}%\tShort Right:  ${shortRight}%\nDeep left:   ${deepLeft}%\t  Deep Mid:  ${deepMid}%\tDeep right:  ${deepRight}%`;    
  }
  return message;
}

tools.getBreakdown = function(teamname) {
  let team = teamname.toUpperCase();
  let stats = teamStats[team];
  return getStats(stats, leagueStats)
}

tools.getTargets = function(teamname) {
  let team = teamname.toUpperCase();
  let stats = teamStats[team];
  return getTargets(stats);
}

module.exports = tools;