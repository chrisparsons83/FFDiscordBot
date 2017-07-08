// tc216997 reworked from switches
const utilities = require(__dirname + '/../lib/utilities');
const rotoworld = require(__dirname + '/../lib/rotoworld');
const espn = require(__dirname + '/../lib/espn');
let commands = {};

commands['.8ball'] = function(question) {
  return new Promise((resolve, reject) => {
    if (!question) return;
    resolve(utilities.eightBall());
  });
}

commands['.choose'] = function(args) {
  return new Promise( (resolve, reject) => {
    if (!args) return;
    resolve(utilities.chooseOne(args.split(' ')));
  });
}

commands['.next5'] = function(team) {
  return new Promise( (resolve, reject) => {
    if (!team) return;
    resolve(espn.next5(team));
  });
}

commands['.roto'] = function(name) {
  return new Promise ( (resolve, reject) => {
    if (!name) return;
    resolve(rotoworld.getPlayer(name));
  });
}

module.exports = commands;