const csvReader = require('csvtojson');
const stats = require('./stats.json');
const fs = require('fs');
const teamStats = require('./teamstats.json');

console.log(teamStats)

/*
let teamLookup = {'CLE':'Cleveland Browns','DET':'Detroit Lions','BAL':'Baltimore Ravens','GB':'Green Bay Packers','MIN':'Minnesota Vikings','CHI':'Chicago Bears','LAR':'Los Angeles Rams','WAS':'Washington Redskins','NYG':'New York Giants','ARI':'Arizone Cardinals','IND':'Indianapolis Colts',
  'SEA':'Seattle Seahawks','KC':'Kansas City Chiefs','PIT':'Pittsburgh Steelers','NO':'New Orleans Saints','JAX':'Jacksonville Jaguars','LAC':'Los Angeles Chargers','DEN':'Denver Broncos','MIA':'Miami Dolphins','NYJ':'New York Jets','ATL':'Atlanta Falcons','OAK':'Oakland Raiders','PHI':'Philadelphia Eagles',
  'CIN':'Cincinnati Bengals','TB':'Tampa Bay Buccaneers','HOU':'Houston Texans','CAR':'Carolina Panthers','SF':'San Francisco 49ers','NE':'New England Patriots','TEN':'Tennessee Titans','BUF':'Buffalo Bills','DAL':'Dallas Cowboys',}
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