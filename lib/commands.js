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
              \n**!8ball** *Question* \t`E.g. !8ball will i win my matchup this weekend?` \
              ```>> You bet!```\
              \n**!choose** *Player\'s names* \t`E.g. !choose peterson miller freeman` \
              ```>> freeman```\
              \n**!next5** *Team symbol* \t`E.g. !next5 nyg` \
              ```>> PIT, @CLE, NYJ, @NE, @DAL``` \
              \n**!roto** *Player\'s full name* \t`E.g. !roto drew brees` \
              ```>> Drew Brees: Drew Brees fully intends to play out the final year of his contract this season. \n\n"Honestly, my mind has not been there at all," Brees said of an extension. "It\'s really a non-issue. For me, it\'s all about this season and how good can we be this season." Per a clause in Brees\' contract, he cannot be franchise tagged next offseason. Brees said earlier this year he could play until he\'s 45. He\'s leaving open the possibility that could be somewhere other than New Orleans. Jul 27 - 5:41 PM``` \
              \n**!breakdown** *Team symbol* ```\nE.g. !breakdown atl``` \
              ```>>```\
            ');
  });
}
module.exports = commands;