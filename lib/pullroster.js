const request = require('request');
const cheerio = require('cheerio');
const nflteams = require('../stats/nflteamsdata.json');
const teamLookup = require('../stats/teamLookup.json');
const fs = require('fs')
let playersArray = [];


for (let i = 0; i < nflteams.length; i++) {
  setTimeout(() => {
    getRosters(nflteams[i].abbreviation.toUpperCase());
  }, 5000*i);
}

function getRosters(teamSymbol) {
  console.log(`pulling ${teamSymbol} roster data`);
  let roster = pullData(teamSymbol);
  roster.then((result) => {
    playersArray = playersArray.concat(result);
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

function pullData(team) {
  return new Promise((resolve, reject) => {
    let roster = [];
    let teamname = teamLookup[team].name.toLowerCase();  
    if (team === 'ARI') {
      team = 'ARZ'
    }
    const url = `https://www.ourlads.com/nfldepthcharts/roster/${team}`;
    request(url, (error, response, body) => {
      if (error && response.statusCode !== 200) {
        reject(error);
      }
      // depthchart is an empty object
      const $ = cheerio.load(body);
      $('TR.row-dc-wht, TR.row-dc-grey').each(function eachRow() {
        // get the text
        let rosterObj = {};
        let offenseOnly = ['qb','rb', 'fb', 'te', 'wr', 'k']
        let pos = $(this).children('td:nth-child(3)').text().toLowerCase();  
        let p = $(this).children('td:nth-child(2)').text().toLowerCase();
        // special case designation for kick, change from site pk to k
        if (pos === 'pk') {
          pos = 'k';
        }
        // in case player listed has 2 position, then we take his primary position
        if (pos.includes('/')) {
          pos = pos.split('/').shift()
        }
        if (offenseOnly.includes(pos)) {
          let splitName = p.split(',').reverse()
          let firstName = splitName[0].trim();
          let lastName = splitName[1];
          let fullName = `${firstName} ${lastName}`;
          rosterObj.team = teamname;
          rosterObj.symbol = team;
          rosterObj.fullname = fullName;
          rosterObj.first = firstName;
          rosterObj.last = lastName;
          rosterObj.position = pos;
          roster.push(rosterObj)          
        }
      });

      resolve(roster);
    });
  });
}