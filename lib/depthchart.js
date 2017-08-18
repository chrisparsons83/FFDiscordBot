const request = require('request');
const cheerio = require('cheerio');
const teamLookup = require(__dirname + '/../stats/teamLookup.json');

const getDepthChart = function (ros, posLookup, body) {
  let $ = cheerio.load(body);
  let row1 = $('.row1');
  let row2 = $('.row2');
  for (let i = 2; i < row1.length; i++) {
    let players = []
    let pos = posLookup[$(row1[i]).children().first().text().toLowerCase()];
    $(row1[i]).children('td').find('a').each(function(i, elem) {
      if ($(this).text() !== '') {
        players.push($(this).text());
      }
    });
    if (pos) {
      players.forEach(name => {
        ros[pos].push(name);
      });
    }
    
  }
  for (let i = 0; i < row2.length; i++) {
    let players = []
    let pos = posLookup[$(row2[i]).children().first().text().toLowerCase()];
    $(row2[i]).children('td').find('a').each(function(i, elem) {
      if ($(this).text() !== '') {
        players.push($(this).text());
      }
    });
    if (pos) {
      players.forEach(name => {
        ros[pos].push(name);
      });
    }
  }
  for(key in ros) {
    if (ros[key].length === 0) {
      ros[key] = ['None listed'];
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
        let roster = { qb:[], rb:[], fb:[], wr:[], te:[], lt:[], lg:[], c:[], rg:[], rt:[], ldt:[], lde:[], ndt:[], rdt:[], rde:[], mlb:[], slb:[], wlb:[], rcb:[],
                       lcb:[], ss:[], fs:[], p:[], ls:[], h:[], k: [], kr: [], pr: [], };
        let positionLookup = {'quarterback': 'qb','running back': 'rb', 'full back': 'fb','wide receiver': 'wr', 'tight end': 'te', 'kicker': 'k','kick returner': 'kr', 'punt returner': 'pr', 
                         'left tackle':'lt', 'left guard':'lg', 'center':'c', 'right guard':'rg', 'right tackle':'rt', 'left defensive tackle':'ldt', 'left defensive end':'lde', 'nose tackle':'ndt',
                         'right defensive tackle':'rdt', 'right defensive end':'rde', 'middle linebacker':'mlb', 'strongside linebacker':'slb', 'weakside linebacker':'wlb', 
                         'right cornerback':'rcb', 'left cornerback':'lcb', 'strong safety':'ss', 'free safety':'fs', 'punter':'p', 'long snapper': 'ls', 'holder':'h'}; 

        request(url, (error, response, body) => {         
            if (error && response.statusCode !== 200) {
              reject(error);
            }
            let results = {}
            if (teamname === 'JAC') {
              teamname = 'JAX'
            }
            results.roster = getDepthChart(roster, positionLookup, body);
            results.logo = teamLookup[teamname].logo;
            results.teamname = teamLookup[teamname].name;
            results.url = url;
            results.positionName = getKey(positionLookup, position);
            resolve(results);
        });
        
    });
}

