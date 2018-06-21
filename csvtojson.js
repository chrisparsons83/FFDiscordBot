const csvParser = require('csv-parser');
const fs = require('fs');
const nflStats = './playbyplay.csv';
const teamLookup = require('./stats/teamLookup.json');
const request = require('request');

let array = [];
let leagueAverage = {
  "teamName": "League averages",
  "totalOffensivePlay": 0,
  "totalPassingPlay": 0,
  "totalRushingPlay": 0,
  "totalPassingYards": 0,
  "totalRushingYards": 0,
  "shortPass": 0,
  "deepPass": 0
};

totalTeamStats = {
};

//request.get('http://nflsavant.com/pbp_data.php?year=2017')
readAndParseCsv();

function readAndParseCsv() {
  fs.createReadStream(nflStats)
  .pipe(csvParser())
  .on('data', (row) => {
    let play = {};
    if(row.PlayType === 'RUSH') {
        play.team = row.OffenseTeam;
        play.against = row.DefenseTeam;
        play.playType = row.PlayType;
        play.yards = parseInt(row.Yards);
        play.description = row.Description;
        play.isIncomplete = 0;
        play.isIntercepted = 0;
        play.passType = "";
        array.push(play)
    }
    if(row.PlayType === 'PASS') {
        play.team = row.OffenseTeam;
        play.against = row.DefenseTeam;
        play.playType = row.PlayType;
        play.yards = parseInt(row.Yards);
        play.description = row.Description;
        play.isIncomplete = parseInt(row.IsIncomplete);
        play.isIntercepted = parseInt(row.IsInterception);
        play.passType = row.PassType;
        array.push(play)
    }
  })
  .on('end', () => {
    array.map(play => {
      sumLeagueStats(play);
      sumTeamStats(play)
    });
  });
}

// sum up the team stats
function sumTeamStats(playObj) {
  // first check if team object exist, if it doesnt create the object;
  if (!totalTeamStats.hasOwnProperty(playObj.team)) {
    createTeamObject(playObj);
    arrangeStats(playObj);
  } else {
    arrangeStats(playObj);
  }

}

function arrangeStats(obj) {
  totalTeamStats[obj.team].totalOffensivePlay += 1;
  // check playType
  if (obj.playType === 'RUSH') {
    totalTeamStats[obj.team].totalRushingPlay += 1;
    totalTeamStats[obj.team].totalRushingYards += obj.yards;
  // pass play stats  
  } else {
    totalTeamStats[obj.team].totalPassingPlay += 1;
    totalTeamStats[obj.team].totalPassingYards += obj.yards;
    // check to see if it's incomplete
    if (obj.isIncomplete || obj.isIntercepted) {
      totalTeamStats[obj.team].incomplete += 1;
    } else {
      totalTeamStats[obj.team].complete += 1;
    }
    passDirectionSorter(obj);
    targetSorter(obj, obj.team);
  }
}

function targetSorter(play, team) {
  let string = play.description;
  if (!string.includes('INTERCEPTED') && !string.includes('INCOMPLETE') && !string.includes('EXTRA POINT') && !string.includes('KICKS')) {
    let index1 = play.description.indexOf('PASS');
    let slice1 = play.description.substring(index1)
    let index2 = slice1.indexOf('TO');
    let end2 = slice1.indexOf('FOR')
    let slice2 = slice1.substring(index2)
    let words = slice2.split(' ');
    createTargetObject(words[1], play, play.team);
  }
}

function createTargetObject(word, play, team) {
  // team symbol for future db
  // jersey number for future db
  let jerseyNumber = word.substring(0, 2);
  // player with name and initial
  let player = word.substring(3);
  if (!(player in totalTeamStats[play.team].targets)) {
    totalTeamStats[play.team].targets[player] = {
      total:0,
      shortLeft:0,
      shortMiddle:0,
      shortRight:0,
      deepLeft:0,
      deepMiddle:0,
      deepRight:0
    };
  }
  playerTargetSorter(play, player);
}

function playerTargetSorter(obj, player) {
  // check to see if it's a short pass
    totalTeamStats[obj.team].targets[player].total += 1;
    // check to see directions
    if (obj.passType === 'SHORT RIGHT') {
      totalTeamStats[obj.team].targets[player].shortRight += 1;
    }
    if (obj.passType === 'SHORT MIDDLE') {
      totalTeamStats[obj.team].targets[player].shortMiddle += 1;
    }
    if (obj.passType === 'SHORT LEFT') {
      totalTeamStats[obj.team].targets[player].shortLeft += 1;      
    }
    totalTeamStats[obj.team].deepPass += 1;
    // check to see directions
    if (obj.passTyp === 'DEEP RIGHT') {
      totalTeamStats[obj.team].targets[player].deepRight += 1;
    }
    if (obj.passType === 'DEEP MIDDLE') {
      totalTeamStats[obj.team].targets[player].deepMiddle += 1 ;    
    }
    if (obj.passType === 'DEEP LEFT') {
      totalTeamStats[obj.team].targets[player].deepLeft += 1;    
    }    
}

function passDirectionSorter(obj) {
  // check to see if it's a short pass
  if (obj.passType.includes('SHORT')) {
    totalTeamStats[obj.team].shortPass += 1;
    // check to see directions
    if (obj.passType.includes('RIGHT')) {
      totalTeamStats[obj.team].shortRight += 1;
      totalTeamStats[obj.team].shortRightYards += obj.yards;
      totalTeamStats[obj.team].totalRight += 1;
      totalTeamStats[obj.team].totalRightYards += obj.yards;
    }
    if (obj.passType.includes('MIDDLE')) {
      totalTeamStats[obj.team].shortMiddle += 1 ;
      totalTeamStats[obj.team].shortMiddleYards += obj.yards;
      totalTeamStats[obj.team].totalMiddle += 1;
      totalTeamStats[obj.team].totalMiddleYards += obj.yards;
    }
    if (obj.passType.includes('LEFT')) {
      totalTeamStats[obj.team].shortLeft += 1;
      totalTeamStats[obj.team].shortLeftYards += obj.yards;
      totalTeamStats[obj.team].totalLeft += 1;
      totalTeamStats[obj.team].totalLeftYards += obj.yards;      
    }
  } else {
    totalTeamStats[obj.team].deepPass += 1;
    // check to see directions
    if (obj.passType.includes('RIGHT')) {
      totalTeamStats[obj.team].deepRight += 1;
      totalTeamStats[obj.team].deepRightYards += obj.yards;
      totalTeamStats[obj.team].totalRight += 1;
      totalTeamStats[obj.team].totalRightYards += obj.yards;
    }
    if (obj.passType.includes('MIDDLE')) {
      totalTeamStats[obj.team].deepMiddle += 1 ;
      totalTeamStats[obj.team].deepMiddleYards += obj.yards;
      totalTeamStats[obj.team].totalMiddle += 1;
      totalTeamStats[obj.team].totalMiddleYards += obj.yards;      
    }
    if (obj.passType.includes('LEFT')) {
      totalTeamStats[obj.team].deepLeft += 1;
      totalTeamStats[obj.team].deepLeftYards += obj.yards;
      totalTeamStats[obj.team].totalMiddle += 1;
      totalTeamStats[obj.team].totalMiddleYards += obj.yards;      
    }
  }  
}

// sum up the league stats
function sumLeagueStats(playObj) {
  // add 1 to offensive play
  leagueAverage.totalOffensivePlay += 1;
  // check to see if it's a pass
  if (playObj.playType === 'PASS') {
    leagueAverage.totalPassingPlay += 1;
    leagueAverage.totalPassingYards += playObj.yards;
    if(playObj.passType.includes('DEEP')) {
      leagueAverage.deepPass += 1;
    } else {
      leagueAverage.shortPass += 1;
    }
  } else {
    leagueAverage.totalRushingPlay += 1;
    leagueAverage.totalRushingYards += playObj.yards;
  }
}

function createTeamObject(obj) {
  let teamObject = {
    'teamName': '',
    "totalOffensivePlay":0,
    "totalPassingPlay":0,
    "totalRushingPlay":0,
    "totalPassingYards":0,
    "totalRushingYards":0,
    "complete":0,
    "incomplete":0,
    "shortPass":0,
    "deepPass":0,
    "shortLeft":0,
    "shortLeftYards":0,
    "shortRight":0,
    "shortRightYards":0,
    "shortMiddle":0,
    "shortMiddleYards":0,
    "deepLeft":0,
    "deepLeftYards":0,
    "deepRight":0,
    "deepRightYards":0,
    "deepMiddle":0,
    "deepMiddleYards":0,
    "totalLeft":0,
    "totalLeftYards":0,
    "totalRight":0,
    "totalRightYards":0,
    "totalMiddle":0,
    "totalMiddleYards":0,
    "targets": {},
  };
  if (obj.team === 'LA') {
    teamObject.teamName = teamLookup['LAR'];
  } else {
    teamObject.teamName = teamLookup[obj.team];
  }
  totalTeamStats[obj.team] = teamObject;
}
