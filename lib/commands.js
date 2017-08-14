const utilities = require('./utilities.js');
const rotoworld = require('./rotoworld.js');
const espn = require('./espn.js');
const stats = require('./teamstats.js');
const lib4for4 = require('./4for4.js')

const teamLookup = require(__dirname + '/../stats/teamLookup.json');

let commands = {};

commands['!8ball'] = function(question) {
  return new Promise((resolve, reject) => {
    if(question === '!8ball') {
      resolve('***I don\'t understand blank!***');
    } else {
      resolve(utilities.eightBall());
    }
  });
}

commands['!adp'] = function(name) {
  return new Promise( (resolve, reject) => {
    lib4for4.getADP(name).then((resultObject) => {
      let returnString = 'ADP as of ' + resultObject.LastUpdated + ' via 4for4 for ';
      returnString += resultObject.name + ': '
      returnString += "ESPN: " + resultObject.ADP.ESPN;
      returnString += ", MFL: " + resultObject.ADP.MFL;
      returnString += ", NFL: " + resultObject.ADP.NFL;
      returnString += ", Yahoo: " + resultObject.ADP.Yahoo;
      resolve(returnString);
    }).catch((error) => {
      resolve(error);
    });
  });
}

commands['!choose'] = function(args) {
  return new Promise( (resolve, reject) => {
    if (args === '!choose') {
      resolve('***I need names to choose from!***')
    } else {
      resolve(utilities.chooseOne(args));
    }
  });
}

commands['!next5'] = (team) => {
  return new Promise((resolve, reject) => {
    espn.next5(team).then((results) => {
      resolve(results);
    }).catch((error) => {
      resolve(error);
    });
  });
}

commands['!roto'] = function(name) {
  return new Promise ( (resolve, reject) => {
    if (name === '!roto') {
      resolve('***I need a name to lookup!***');
    } else {
      resolve(rotoworld.getPlayer(name));
    }
  });
}

//get team abbreviations
commands['!symbols'] = function() {
  return new Promise( (resolve, reject) => {
    resolve(utilities.symbolsLookup());
  });
}

//get team stats
commands['!teamstats'] = function(teamname) {
  return new Promise( (resolve, reject) => {
    let valid = teamname.toUpperCase() in teamLookup;
    if (teamname === '!nflsavant') {
      resolve(`***I need a team symbol.***`);
    } else if (!valid) {
      resolve(`***Invalid team symbol.***`)
    } else {
      let team = teamLookup[teamname.toUpperCase()];
      let teamStats = '```' + stats.getBreakdown(teamname) + '```';
      resolve(`\n**${team}**${teamStats}`);
    }
  });
}

commands['!teamtargets'] = function(teamname) {
  return new Promise((resolve, reject) => {
    let valid = teamname.toUpperCase() in teamLookup;
    if (teamname === '!top8targets') {
      resolve(`***I need a team symbol.***`);
    } else if (!valid) {
      resolve(`***Invalid team symbol.***`)
    } else {
      let team = teamLookup[teamname.toUpperCase()];
      let teamStats = '```' + stats.getTargets(teamname) + '```';
      resolve(`**${team}'s 2016 Top 5**\n(Penalties and interception targets are excluded)${teamStats}`);
    }
  });
}

commands['!help'] = function() {
  return new Promise((resolve, reject) => {
    resolve('For command list, see https://github.com/chrisparsons83/RedditFFDiscordBot');
  });
}

commands['!teamdepth'] = function(string) {
  let arg = string.split(',');
  return new Promise((resolve, reject) => {
    if (arg.length < 2) {
      resolve(`***Invalid request. Missing team symbol and/or team position***`);
    } else {
      let teamname = arg[0].toLowerCase();
      let position = arg[1].toLowerCase();
      resolve(`***${teamname} ${position}***`)
    }
  });
}

module.exports = commands;