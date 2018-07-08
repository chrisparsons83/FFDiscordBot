const depthchart = require('./depthchart.js');
const nflteams = require('../stats/nflteamsdata.json');
const lookup = require('../stats/teamLookup.json');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs')

let playersArray = [];

for (let i = 0; i< nflteams.length; i++) {
  setTimeout(() => {
    getRosters(nflteams[i].abbreviation);
  }, 4000*i);
}

function getRosters(teamSymbol) {
  console.log(`pulling ${teamSymbol} roster data`);
  let roster = depthchart.getRoster(teamSymbol, 'rb');
  roster.then((result) => {
    let rosterObject = result.roster;
    let symbol = teamSymbol;
    let teamname = lookup[teamSymbol].name.toLowerCase();
    let position = Object.keys(rosterObject);
    position.map(position => {
      if (position !== 'kr' && position !== 'pr') {
        let obj = rosterObject[position];
        obj.map(players => {
          let player = players.toLowerCase().split(' ');
          let fullname = players.toLowerCase();
          let firstname = player[0];
          let lastname = player[1];
          let playerObject = {};
          playerObject.team = teamname;
          playerObject.symbol = symbol;
          playerObject.fullname = fullname;
          playerObject.first = firstname;
          playerObject.last = lastname;
          playerObject.position = position;
          playersArray.push(playerObject);
       });
      }      
    });
    if (teamSymbol === 'DAL') {
      //this is the last team to pull and should output json data
      fs.writeFile('../stats/players.json', JSON.stringify(playersArray, null, 2), (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('done!')
        }
      })
    }
  });

}
