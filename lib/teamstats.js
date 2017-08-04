const teamStats = require(__dirname + '/../stats/teamstats.json');
const leagueStats = require(__dirname + '/../stats/leagueAverage.json');

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
  let longString = `\n**Total offensive play:  ** ${plays}    \t( *League avg:  ${leagueAvg(leaguePlays)}* ) \
  \n**Pass play:  ** ${getPercent(pass, plays)}%    \t( *League avg:  ${getPercent(leaguePass, leaguePlays)}%* )\
  \n**Rush play:  ** ${getPercent(rush, plays)}%    \t( *League avg:  ${getPercent(leagueRush, leaguePlays)}%* )\
  \n\n**Pass yards attempts:  ** ${passYds} yds  \t( *League avg:  ${leagueAvg(leaguePassYards)} yds* )\
  \n**Total rushing yds:  ** ${rushYds} yds    \t( *League avg:  ${leagueAvg(leagueRushYards)} yds* )\
  \n\n**Avg yds att per pass:  ** ${getAvg(passYds, pass)} yds    \t( *League avg:  ${getAvg(leaguePassYards, leaguePass)} yds* )\
  \n**Avg yds per rush:  ** ${getAvg(rushYds, rush)} yds    \t( *League avg:  ${getAvg(leagueRushYards, leagueRush)} yds* )\
  \n\n**Short passes:  ** ${getPercent(short, pass)}%  ( *League avg:  ${getPercent(leagueShortPass, leaguePass)}%* ) \t**Deep passes:  ** ${getPercent(deep, pass)}%   ( *League avg:  ${getPercent(leagueDeepPass, leaguePass)}%* )\
  \n\n**Left pass:  **${getPercent(leftPass, pass)}%  \t\t\t\t\t **Middle pass: **${getPercent(midPass, pass)}%   \t\t\t\t**Right pass: **${getPercent(rightPass, pass)}%\
  \n**Left yds att:  **${leftPassYds} yds \t\t\t\t **Middle yds att:  **${midPassYds} yds   \t\t**Right yds att:  **${rightPassYds} yds\
  \n**Left yds per att:  **${getAvg(leftPassYds, leftPass)} yds   \t\t**Middle yds per att:  **${getAvg(midPassYds, midPass)} yds   **Right yds per att:  **${getAvg(rightPassYds, rightPass)} yds\
  \n\n**Short left attempts:  **${shortLeft}\t\t\t**Short mid attempts:  **${shortMid}\t\t\t **Short right attempts:  **${shortRight}\
  \n**Deep left attempts:  **${deepLeft}\t\t\t  **Deep mid attempts:  **${deepMid}\t\t\t  **Deep right attempts:  **${deepRight}\
  \n\n**Short left per att:  **${getAvg(shortLeftYds, shortLeft)} yds\t   **Short mid per att:  **${getAvg(shortMidYds, shortMid)} yds\t\t**Short right per att:  **${getAvg(shortRightYds, shortRight)} yds\
  \n**Deep left per att:  **${getAvg(deepLeftYds, deepLeft)} yds\t  **Deep mid per att:  **${getAvg(deepMidYds, deepMid)} yds\t\t**Deep right per att:  **${getAvg(deepRightYds, deepRight)} yds\
  \n\n**Short left:  **${getPercent(shortLeft, leftPass)}%\t\t\t\t\t  **Short middle:  **${getPercent(shortMid, midPass)}%\t\t\t\t**Short right:  **${getPercent(shortRight, rightPass)}%\
  \n**Deep Left:  **${getPercent(deepLeft, leftPass)}%\t\t\t\t\t   **Deep middle:  **${getPercent(deepMid, midPass)}% \t\t\t\t **Deep right:  **${getPercent(deepRight, rightPass)}%\  
  `;
  return longString;
}

module.exports.getBreakdown = function(teamname) {
  let team = teamname.toUpperCase();
  let stats = teamStats[team];
  return getStats(stats, leagueStats);
}

