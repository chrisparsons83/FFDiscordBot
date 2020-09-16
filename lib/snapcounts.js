const request = require('request');
const cheerio = require('cheerio');

const removeDuplicates = (array) => {
  let seen = {};
  return array.filter((item) => {
    return seen.hasOwnProperty(item) ? false: (seen[item] = true);
  })
}



exports.getSnapcounts = (team, position, week, year) => {
  return new Promise((resolve, reject) => {
    //https://www.footballoutsiders.com/stats/snapcounts?team=CAR&week=1&position=QB&year=2018
    
    //let url = `https://www.footballoutsiders.com/stats/snapcounts?team=${team.toUpperCase()}&week=${week}&position=${position.toUpperCase()}&year=${year}`;
    
    let url = `https://www.footballoutsiders.com/stats/snapcounts?team=ALL&week=${week}&position=${position.toUpperCase()}&year=${year}`;

    request.get(url, (err, response, body) => {
      if (err && response.statusCode !== 200) {
        reject(err);
      }
      
      let array = []; 
      const $ = cheerio.load(body);
      const rows = $('#edit-table').find('tr');
      for (let i = 0; i < rows.length; i++) {
        //filter only the team requested
        if ($(rows[i]).children('td:nth-child(2)').text() === team) {
          let player = $(rows[i]).children('td:nth-child(1)').text();
          let snapPct;
          if (week === 'ALL') {
            snapPct = $(rows[i]).children('td:nth-child(6)').text();
          } else {
            snapPct = $(rows[i]).children('td:nth-child(7)').text();
          }
          if (parseFloat(snapPct) > 0) {
            let string = `${player.slice(3, player.length)}  (${parseFloat(snapPct)}%)`
            array.push(string);
          }
        }
      }
  
      let unique = removeDuplicates(array);
      unique.sort((a,b) => {
        return (Number((b.match(/(\d+)/g)[0])) - Number(a.match(/(\d+)/g)[0]));
      });
      
      // player, team, position, started, total snaps, offsnaps, off snap pct, def snaps, def snap pct, st snaps, st snap pct
      if (array.length === 0) {
        reject(`No data available for ${(week.toUpperCase() === 'ALL')? year:'Week ' + week + ', ' + year}. Try again later.`);
      } else {
        resolve(unique);
      }
    });
  });

};
