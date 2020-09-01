const csvParser = require('csv-parser');
const fs = require('fs');
const teamLookup = require('../stats/teamLookup.json');
const request = require('request');
const nflSavantUrl = 'http://nflsavant.com/pbp_data.php?year=2019';

let array = [];
let leagueAverage = {
  'teamName': 'League averages',
  'totalOffensivePlay': 0,
  'totalPassingPlay': 0,
  'totalRushingPlay': 0,
  'totalPassingYards': 0,
  'totalRushingYards': 0,
  'shortPass': 0,
  'deepPass': 0
};
let totalTeamStats = {
};

readAndParseCsv();

// fetches csv file from nfl savant
function readAndParseCsv() {
  request.get(nflSavantUrl)
  //fs.createReadStream('pbp-2019.csv')
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
        play.passType = '';
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
    
    totalTeamStats = renameKey(totalTeamStats, 'LA', 'LAR');
    writeToJson(leagueAverage, totalTeamStats);
  });
}

// rename keys
function renameKey(object, key, newKey) {
  const clonedObj = Object.assign({}, object);
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;
  return clonedObj;
};

function writeToJson(leagueAverage, teamStats) {
  fs.writeFile('../stats/leagueAverage.json', JSON.stringify(leagueAverage, null, 2), () => {
    console.log('Writing to league average json done.')
  });
  fs.writeFile('../stats/teamstats.json', JSON.stringify(teamStats, null, 2), () => {
    console.log('Writing to teamstats.json done.')
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

function arrangeStats(play) {
  totalTeamStats[play.team].totalOffensivePlay += 1;
  // check playType
  if (play.playType === 'RUSH') {
    totalTeamStats[play.team].totalRushingPlay += 1;
    totalTeamStats[play.team].totalRushingYards += play.yards;
  // pass play stats  
  } 
  if (play.playType === 'PASS') {
    totalTeamStats[play.team].totalPassingPlay += 1;
    totalTeamStats[play.team].totalPassingYards += play.yards;
    // check to see if it's incomplete
    if (play.isIncomplete || play.isIntercepted) {
      totalTeamStats[play.team].incomplete += 1;
    } else {
      totalTeamStats[play.team].complete += 1;
    }
    passDirectionSorter(play);
    slicePlayDescription(play);
  }
}

// slices play description and make it sortable
function slicePlayDescription(play) {
  let string = play.description;
  if (!string.includes('INTERCEPTED') && !string.includes('EXTRA POINT') && !string.includes('KICKS') && (string.includes('MIDDLE TO') || string.includes('LEFT TO') || string.includes('RIGHT TO'))) {
    let index1 = play.description.indexOf('PASS');
    let slice1 = play.description.substring(index1).split(' ');
    let index2 = slice1.findIndex(word =>{ return word === 'TO'});
    let str = slice1[index2+1]
    // special edge case for damien williams since they decide to use a space at the end of first name initial
    if (str === '26-DAM.') {
      str = slice1[index2+1] + slice1[index2+2]
    }
    createTargetObject(str, play, play.team);
  }
}

// create a target object for player
function createTargetObject(word, play, team) {
  // team symbol for future db
  // jersey number for future db
  let jerseyNumber = word.split('-')[0];
  let name = word.split('-')[1].replace(/\.$/, "");;  
  // player with name and initial
  if (!(name in totalTeamStats[play.team].targets)) {
    totalTeamStats[play.team].targets[name] = {
      total:0,
      totalLeft:0,
      totalMiddle:0,
      totalRight:0,
      shortPass:0,
      shortLeft:0,
      shortMiddle:0,
      shortRight:0,
      deepPass:0,
      deepLeft:0,
      deepMiddle:0,
      deepRight:0
    };
  }
  playerTargetSorter(play, name);
}

// rearrange stats for each player
function playerTargetSorter(obj, player) {
  // check to see if it's a short pass
    totalTeamStats[obj.team].targets[player].total += 1;
    // check to see directions
    if (obj.passType === 'SHORT RIGHT') {
      totalTeamStats[obj.team].targets[player].shortRight += 1;
      totalTeamStats[obj.team].targets[player].shortPass += 1;
      totalTeamStats[obj.team].targets[player].totalRight += 1;
    }
    if (obj.passType === 'SHORT MIDDLE') {
      totalTeamStats[obj.team].targets[player].shortMiddle += 1;
      totalTeamStats[obj.team].targets[player].shortPass += 1;
      totalTeamStats[obj.team].targets[player].totalMiddle += 1;
    }
    if (obj.passType === 'SHORT LEFT') {
      totalTeamStats[obj.team].targets[player].shortLeft += 1;  
      totalTeamStats[obj.team].targets[player].shortPass += 1;
      totalTeamStats[obj.team].targets[player].totalLeft += 1;    
    }
    // check to see directions
    if (obj.passType === 'DEEP RIGHT') {
      totalTeamStats[obj.team].targets[player].deepRight += 1;
      totalTeamStats[obj.team].targets[player].deepPass += 1;
      totalTeamStats[obj.team].targets[player].totalRight += 1;
    }
    if (obj.passType === 'DEEP MIDDLE') {
      totalTeamStats[obj.team].targets[player].deepMiddle += 1
      totalTeamStats[obj.team].targets[player].deepPass += 1;
      totalTeamStats[obj.team].targets[player].totalMiddle += 1;
    
    }
    if (obj.passType === 'DEEP LEFT') {
      totalTeamStats[obj.team].targets[player].deepLeft += 1;
      totalTeamStats[obj.team].targets[player].deepPass += 1;
      totalTeamStats[obj.team].targets[player].totalLeft += 1;
    }
     
}

// rearrange pass direction stats
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
  } 
  if (obj.passType.includes('DEEP')) {
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

// this create an individual team object for the stats to be summed up
function createTeamObject(obj) {
  let teamObject = {
    'teamName': '',
    'totalOffensivePlay':0,
    'totalPassingPlay':0,
    'totalRushingPlay':0,
    'totalPassingYards':0,
    'totalRushingYards':0,
    'complete':0,
    'incomplete':0,
    'shortPass':0,
    'deepPass':0,
    'shortLeft':0,
    'shortLeftYards':0,
    'shortRight':0,
    'shortRightYards':0,
    'shortMiddle':0,
    'shortMiddleYards':0,
    'deepLeft':0,
    'deepLeftYards':0,
    'deepRight':0,
    'deepRightYards':0,
    'deepMiddle':0,
    'deepMiddleYards':0,
    'totalLeft':0,
    'totalLeftYards':0,
    'totalRight':0,
    'totalRightYards':0,
    'totalMiddle':0,
    'totalMiddleYards':0,
    'targets': {},
  };
  if (obj.team === 'LA') {
    teamObject.teamName = teamLookup['LAR'];
  } else {
    teamObject.teamName = teamLookup[obj.team];
  }
  totalTeamStats[obj.team] = teamObject;
}
