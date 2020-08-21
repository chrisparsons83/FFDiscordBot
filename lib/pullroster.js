const request = require('request');
const fs = require('fs')
const teamLookup = require('../stats/teamLookup.json');
const sleeper = {};

sleeper.getRoster = () => {
  let array = [];
  let validPosition = ['wr', 'rb', 'te', 'qb', 'k'];
  return new Promise((resolve, reject) => {
    request.get('https://api.sleeper.app/v1/players/nfl', (err, response, body) => {
      if (err && response.statusCode !== 200) {
        reject('Error pulling sleeper roster data')
      } else {
        let sleeperPlayers = JSON.parse(body);
        Object.keys(sleeperPlayers).map(key => {
          let playerObj = sleeperPlayers[key];
          let obj = {}
          // only get players / not dst
          if (!isNaN(key) && playerObj.team && playerObj.depth_chart_order && playerObj.position && validPosition.includes(playerObj.position.toLowerCase())) {
            // teamName, teamSymbol, full name, first, last, position, sleeperid, rotowireid, espnid, yahooid
            //temp fix for new team name change until a solution is put in
            if (playerObj.team === 'LV') {
              obj.team = 'las vegas raiders'
            } else {
              obj.team = teamLookup[playerObj.team].name.toLowerCase();
            }
            obj.symbol =  playerObj.team.toLowerCase();
            obj.fullname = playerObj.full_name.toLowerCase();
            obj.first = playerObj.first_name.toLowerCase();
            obj.last = playerObj.last_name.toLowerCase();
            obj.position = playerObj.position.toLowerCase();
            obj.jersey_number = playerObj.number;
            obj.sleeper_id = key;
            obj.rotowire_id = playerObj.rotowire_id;
            obj.espn_id = playerObj.espn_id;
            obj.yahoo_id = playerObj.yahoo_id;
            array.push(obj);
          }
        });
        resolve(array)
      }
    })
  });
}


sleeper.getRoster().then(array => {
  // do something with array
    //this is the last team to pull and should output json data
  fs.writeFile('../stats/players.json', JSON.stringify(array, null, 2), (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('done!')
    }
  })
});


module.exports = sleeper;