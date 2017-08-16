const request = require('request');
const cheerio = require('cheerio');
const teamLookup = require(__dirname + '/../stats/teamLookup.json');

const getDepthChart = function (ros, posLookup, body) {
  let $ = cheerio.load(body);
  let row1 = $('.row1');
  let row2 = $('.row2');
  for (let i = 2; i < row1.length; i++) {
    let pos = posLookup[$(row1[i]).children().first().text().toLowerCase()];
    let players = $(row1[i]).children().next().text().split(' ');
    players.pop();
    if (pos) {
      for (let j = 0; j < players.length; j+=2) {
        let first = players[j].replace(/\s/g, '');
        let last = players[j+1];
        ros[pos].push(`${first} ${last}`);
      }
    }
  }
  for (let i = 0; i < row2.length; i++) {
    let pos = posLookup[$(row2[i]).children().first().text().toLowerCase()];
    let players = $(row2[i]).children().next().text().split(' ');
    players.pop();
    if (pos) {
      for (let j = 0; j < players.length; j+=2) {
        let first = players[j].replace(/\s/g, '');
        let last = players[j+1];
        ros[pos].push(`${first} ${last}`);
      }
    }
  }
  return ros;
}

exports.getRoster = (teamname) => {
    let city = teamLookup[teamname].split(' ')[0].toLowerCase();
    let mascot = teamLookup[teamname].split(' ')[1].toLowerCase();
    // cbs uses JAC instead of JAX for jags
    return new Promise((resolve, reject) => {
        let url = `https://www.cbssports.com/nfl/teams/depth-chart/${teamname}/${city}-${mascot}`;
        let roster = { qb:[], rb:[], fb:[], wr:[], te:[], lt:[], lg:[], c:[], rg:[], rt:[], ldt:[], lde:[], rdt:[], rde:[], mlb:[], slb:[], wlb:[], rcb:[],
                       lcb:[], ss:[], fs:[], p:[], ls:[], h:[], k: [], kr: [], pr: [], };
        let posLookup = {'quarterback': 'qb','running back': 'rb', 'full back': 'fb','wide receiver': 'wr', 'tight end': 'te', 'kicker': 'k','kick returner': 'kr', 'punt returner': 'pr', 
                         'left tackle':'lt', 'left guard':'lg', 'center':'c', 'right guard':'rg', 'right tackle':'rt', 'left defensive tackle':'ldt', 'left defensive end':'lde',
                         'right defensive tackle':'rdt', 'right defensive end':'rde', 'middle linebacker':'mlb', 'strongside linebacker':'slb', 'weakside linebacker':'wlb', 
                         'right cornerback':'rcb', 'left cornerback':'lcb', 'strong safety':'ss', 'free safety':'fs', 'punter':'p', 'long snapper': 'ls', 'holder':'h'}; 

        request(url, (error, response, body) => {         
            if (error && response.statusCode !== 200) {
              reject(error);
            }
            let results = getDepthChart(roster, posLookup, body);
            resolve(results)
        });
        
    });
}

