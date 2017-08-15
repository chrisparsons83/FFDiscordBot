const request = require('request');
const cheerio = require('cheerio');
const teamLookup = require(__dirname + '/../stats/teamLookup.json');

exports.getRoster = (teamname) => {
    let arg1 = teamLookup[teamname].split(' ')[0].toLowerCase();
    let arg2 = teamLookup[teamname].split(' ')[1].toLowerCase();
    return new Promise((resolve, reject) => {
        let url = `https://www.cbssports.com/nfl/teams/depth-chart/${teamname}/${arg1}-${arg2}`;
        let roster = { qb:[], rb:[], fb:[], wr:[], te:[], k: [], kr: [], pr: [], }
        let posLookup = {'quarterback': 'qb','running back': 'rb', 'full back': 'fb','wide receiver': 'wr', 'tight end': 'te', 'kicker': 'k','kick returner': 'kr', 'punt returner': 'pr', } 
        request(url, (error, response, body) => {         
            if (error && response.statusCode !== 200) {
              reject(error);
            }
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
                  roster[pos].push(`${first} ${last}`);
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
                  roster[pos].push(`${first} ${last}`);
                }
              }
            }
            resolve(roster)
        });
    });
}