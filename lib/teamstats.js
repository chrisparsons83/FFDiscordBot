const teamStats = require(__dirname + '/../stats/teamstats.json');
const leagueStats = require(__dirname + '/../stats/leagueAverage.json');

const getStats = function(stats, league) {
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

// for future references in case i forgot what the data structure looks like
/*
let league = {
  'teamName': 'League averages',
  'totalOffensivePlay': 0,
  'totalPassingPlay': 0,
  'totalRushingPlay': 0,
  'totalPassingYards': 0,
  'totalRushingYards': 0,
  'shortPass': 0,
  'deepPass': 0,
}

*/

/*
  "ATL":{
    "totalOffensivePlay":963,
    "totalPassingPlay":564,
    "totalRushingPlay":399,
    "totalPassingYards":5178,
    "totalRushingYards":1894,
    "shortPass":454,
    "deepPass":110}
*/

/*
{ "team":"JAX",
  "playType":"PASS",
  "isRush":"0",
  "isPass":"1",
  "yards":"15",
  "passType":"SHORT MIDDLE"}
*/

/*
let teamStats = {}
stats.forEach(play => {
  // check if team symbol exists
  if(!(play.team in teamStats)) {
    teamStats[play.team] = {
      teamName: teamLookup[play.team],
      totalOffensivePlay: 0,
      totalPassingPlay: 0,
      totalRushingPlay: 0,
      totalPassingYards:0,
      totalRushingYards:0,
      shortPass: 0,
      deepPass: 0,
    }
    // logic to calculate team stats
    teamStats[play.team].totalOffensivePlay += 1;

    if (play.playType === 'PASS') {
      teamStats[play.team].totalPassingPlay += 1;
      teamStats[play.team].totalPassingYards += parseInt(play.yards);
      play.passType.includes('SHORT') ? teamStats[play.team].shortPass += 1: teamStats[play.team].deepPass += 1; 
    } else {
      teamStats[play.team].totalRushingPlay += 1;
      teamStats[play.team].totalRushingYards += parseInt(play.yards);
    }

  } else {
    teamStats[play.team].totalOffensivePlay += 1;

    if (play.playType === 'PASS') {
      teamStats[play.team].totalPassingPlay += 1;
      teamStats[play.team].totalPassingYards += parseInt(play.yards);
      play.passType.includes('SHORT') ? teamStats[play.team].shortPass += 1: teamStats[play.team].deepPass += 1; 
    } else {
      teamStats[play.team].totalRushingPlay += 1;
      teamStats[play.team].totalRushingYards += parseInt(play.yards);
    }

  }
});

fs.writeFile('teamstats.json', JSON.stringify(teamStats), 'utf-8', () => {
  console.log('done');
});
*/