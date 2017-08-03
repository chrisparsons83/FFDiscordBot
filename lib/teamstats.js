const teamStats = require(__dirname + '/../stats/teamstats.json');
const leagueStats = require(__dirname + '/../stats/leagueAverage.json');

//breakdown and show stats from the json files
const getStats = function(stats, league) {
  // massive long string for discord bot to send
  // it makes the message more structure
  // need a more elegant way to fix this
  let longString = `\n**Total offensive play:  ** ${stats.totalOffensivePlay}  (*League avg:  ${((league.totalOffensivePlay)/32).toFixed(2)}*) \
  \n**Pass play:  ** ${(stats.totalPassingPlay/stats.totalOffensivePlay*100).toFixed(2)}%  (*League avg:  ${(league.totalPassingPlay/league.totalOffensivePlay*100).toFixed(2)}%*)\
  \n**Rush play:  ** ${(stats.totalRushingPlay/stats.totalOffensivePlay*100).toFixed(2)}%  (*League avg:  ${(league.totalRushingPlay/league.totalOffensivePlay*100).toFixed(2)}%*)\
  \n**Attempted passing yards(completion + incompletion):  ** ${stats.totalPassingYards} yds  (*League avg:  ${(league.totalPassingYards/32).toFixed(2)} yds*)\
  \n**Total rushing yards:  ** ${stats.totalRushingYards} yds  (*League avg:  ${(league.totalRushingYards/32).toFixed(2)} yds*)\
  \n**Avg yards attempted per pass:  ** ${(stats.totalPassingYards/stats.totalPassingPlay).toFixed(2)} yds  (*League avg:  ${(league.totalPassingYards/league.totalPassingPlay).toFixed(2)} yds*)\
  \n**Avg yards per rush:  ** ${(stats.totalRushingYards/stats.totalRushingPlay).toFixed(2)} yds  (*League avg:  ${(league.totalRushingYards/league.totalRushingPlay).toFixed(2)} yds*)\
  \n\n**Short pass percentage:  ** ${(stats.shortPass/stats.totalPassingPlay*100).toFixed(2)}%  (*League avg:  ${(league.shortPass/league.totalPassingPlay*100).toFixed(2)}%*)\
  \n**Deep pass percentage:  ** ${(stats.deepPass/stats.totalPassingPlay*100).toFixed(2)}%  (*League avg:  ${(league.deepPass/league.totalPassingPlay*100).toFixed(2)}%*)\
  `;
  return longString;
}

module.exports.getBreakdown = function(teamname) {
  let team = teamname.toUpperCase();
  let stats = teamStats[team];
  return getStats(stats, leagueStats);
}

