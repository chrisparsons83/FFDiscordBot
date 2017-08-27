const request = require('request');
const xmlParser = require('xml2js').parseString;
const fs = require('fs');

const gameId = [];
// http://www.nfl.com/ajax/scorestrip?season=2017&seasonType=PRE&week=1

const writeFile = (item)=> {
  fs.writeFile('gameid.json', JSON.stringify(item, null, 2), 'utf-8', () => {
    console.log('writing file now');
  });
}

const getGameId = (week )=> {
  const url = `http://www.nfl.com/ajax/scorestrip?season=2017&seasonType=REG&week=${week}`;
  request.get(url, (err, res, body) => {
    xmlParser(body, (err, result) => {
      // so far im only getting the gameId, theres alot more info in the json object
      let json = result.ss.gms[0];
      let games = json['g'];
      games.forEach((item) => {
        gameId.push(item['$'].eid);
      });
      if (week === 17) {
        // finished pulling everything. do what you want with game id
        // i used fs to write to a json
        console.log(gameId);
      }
    });
  });
}

for(let i = 1; i <= 17; i++) {
  setTimeout(() => {
    console.log(`Pulling week ${i} gameid`);
    getGameId(i);
  }, i * 1000);
}

