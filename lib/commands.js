const utilities = require('./utilities.js');
const rotoworld = require('./rotoworld.js');
const espn = require('./espn.js');
const stats = require('./teamstats.js')

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

commands['!choose'] = function(args) {
  return new Promise( (resolve, reject) => {
    if (args === '!choose') {
      resolve('***I need names to choose from!***')
    } else {
      resolve(utilities.chooseOne(args.split(' ')));
    }
  });
}

commands['!next5'] = function(team) {
  return new Promise( (resolve, reject) => {
    if (team === '!next5') {
      resolve('***I need a team symbol to lookup!***')
    } else {
      resolve(espn.next5(team));      
    }
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
  })
}

commands['!help'] = function() {
  return new Promise((resolve, reject) => {
    resolve('Here are my commands: \n\
      \n**!8ball** *Question* \t`E.g. !8ball will i win my matchup this weekend?` \
      ```>> You bet!```\
      \n**!choose** *Player\'s names* \t`E.g. !choose peterson miller freeman` \
      ```>> freeman```\
      \n**!next5** *Team symbol* \t`E.g. !next5 nyg` \
      ```>> PIT, @CLE, NYJ, @NE, @DAL``` \
      \n**!roto** *Player\'s full name* \t`E.g. !roto drew brees` \
      ```>>Drew Brees: Drew Brees fully intends to play out the final year of his contract this season. \n\n"Honestly, my mind has not been there at all..."\n and so on...``` \
      \n**!symbols** `Show team symbols`\
      ```>>ARI : Arizone Cardinals\nATL : Atlanta Falcons\nBAL : Baltimore Ravens\n and so on...```\
      \n**!teamstats** *team symbol* \t`E.g. !teamstats atl` \
      ```>>Atlanta Falcons\n\nTotal offensive play:   963  (League avg:  992.06)\nPass play:   58.57%  (League avg:  60.85%)\n and so on...```\
      \n**!teamtargets** *team symbol* \t`E.g. !teamtargets ne` \
      ```>>2016 New England Patriots Top 5\n\nJ. Edelman\nTotal Targets(Excluding penalties and ints):  152\nShort Left:  26.32%     Short Mid:  26.97%    Short Right:  26.97%\nDeep left:  8.55%        Deep Mid:  2.63%     Deep right:  8.55% \nand so on...```\
    ');
  });
}
module.exports = commands;