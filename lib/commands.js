// tc216997 reworked from switches
const utilities = require(__dirname + '/../lib/utilities');
const rotoworld = require(__dirname + '/../lib/rotoworld');
const espn = require(__dirname + '/../lib/espn');
let commands = {};

commands['!8ball'] = function(question) {
  return new Promise((resolve, reject) => {
    if (!question) return;
    resolve(utilities.eightBall());
  });
}

commands['!choose'] = function(args) {
  return new Promise( (resolve, reject) => {
    if (!args) return;
    resolve(utilities.chooseOne(args.split(' ')));
  });
}

commands['!next5'] = function(team) {
  return new Promise( (resolve, reject) => {
    if (!team) return;
    resolve(espn.next5(team));
  });
}

commands['!roto'] = function(name) {
  return new Promise ( (resolve, reject) => {
    if (!name) return;
    resolve(rotoworld.getPlayer(name));
  });
}

commands['!breakdown'] = function(teamname) {
  return new Promise( (resolve, reject) => {
    if (!teamname) return;
    //resolve(filename.getBreakdown(teamname))
  })
}

commands['!help'] = function() {
  return new Promise((resolve, reject) => {
    resolve('Here are my commands: \n\
              \n**.8ball** ***Question*** `E.g. .8ball Will I win my matchup this weekend?` for magic 8-ball. \n\
              \n**.choose** ***Last or first names*** `E.g. .choose peterson miller freeman` to randomly choose a player. \n\
              \n**.next5** ***Team symbol*** `E.g. .next5 nyg` for the team\'s next 5 upcoming games. \n\
              \n**.roto** ***Player\'s full name*** `E.g. .roto drew brees` to get latest roto news on the player. \n\
              \n**.breakdown** ***Team symbol*** for the team\'s offensive breakdown. `E.g. .breakdown atl` \nStats were provided by nflsavant.com\n\
            ');
  });
}
module.exports = commands;