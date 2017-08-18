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

const getKey = function(obj, val) {
  return Object.keys(obj).find(key => obj[key] === val);
}

exports.getRoster = (teamname, position) => {
    let team = teamLookup[teamname].name.toLowerCase();
    let arr = team.split(' ');
    let mascot = arr.pop();
    let city = arr.join('-');
    // special case for jackonsville using cbssports
    if (teamname === 'JAX') {
      teamname = 'JAC'
    }
    return new Promise((resolve, reject) => {
        let url = `https://www.cbssports.com/nfl/teams/depth-chart/${teamname}/${city}-${mascot}`;
        let roster = { qb:[], rb:[], fb:[], wr:[], te:[], lt:[], lg:[], c:[], rg:[], rt:[], ldt:[], lde:[], rdt:[], rde:[], mlb:[], slb:[], wlb:[], rcb:[],
                       lcb:[], ss:[], fs:[], p:[], ls:[], h:[], k: [], kr: [], pr: [], };
        let positionLookup = {'quarterback': 'qb','running back': 'rb', 'full back': 'fb','wide receiver': 'wr', 'tight end': 'te', 'kicker': 'k','kick returner': 'kr', 'punt returner': 'pr', 
                         'left tackle':'lt', 'left guard':'lg', 'center':'c', 'right guard':'rg', 'right tackle':'rt', 'left defensive tackle':'ldt', 'left defensive end':'lde',
                         'right defensive tackle':'rdt', 'right defensive end':'rde', 'middle linebacker':'mlb', 'strongside linebacker':'slb', 'weakside linebacker':'wlb', 
                         'right cornerback':'rcb', 'left cornerback':'lcb', 'strong safety':'ss', 'free safety':'fs', 'punter':'p', 'long snapper': 'ls', 'holder':'h'}; 

        request(url, (error, response, body) => {         
            if (error && response.statusCode !== 200) {
              reject(error);
            }
            let results = getDepthChart(roster, positionLookup, body);
            //console.log(results)
            if (teamname === 'JAC') {
              teamname = 'JAX'
            }
            let team = teamLookup[teamname].name;
            let logo = teamLookup[teamname].logo;
            let string = getKey(positionLookup, position);
            let positionString = string[0].toUpperCase() + string.slice(1, string.length);
            let list = results[position];
            let embed = {
              "embed": {
                "title": `${team}`,
                "description": `2017 ${positionString} depth chart`,
                "url":url,
                "color": 11913417,
                "thumbnail":{"url":logo},
                "fields": [],
              }          
            };
            for (let i = 0; i < list.length; i++) {
              embed.embed.fields.push({'name': `${position.toUpperCase()} #${i+1}`, 'value':list[i], 'inline':true});
            }
            resolve(embed)
        });
        
    });
}

