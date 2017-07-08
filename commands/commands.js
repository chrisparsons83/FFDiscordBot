const utilities = require(__dirname + '/../lib/utilities.js');
let commands = {};

commands['.8ball'] = function(args) {
  return new Promise((resolve, reject) => {
    if (!args) return;
    resolve(utilities.eightBall());
  });
}

commands['.choose'] = function(args) {
  return new Promise( (resolve, reject) => {
    if (!args) return;
    resolve(utililies.choseOne(args));
  });
}

module.exports = commands;