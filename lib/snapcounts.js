const request = require('request');
const cheerio = require('cheerio');
const url = 'https://www.footballoutsiders.com/stats/snapcounts';
const moment = require('moment');

const removeDuplicates = (array) => {
  let seen = {};
  return array.filter((item) => {
    return seen.hasOwnProperty(item) ? false: (seen[item] = true);
  })
}



exports.getSnapcounts = (team, position, week) => {
  return new Promise((resolve, reject) => {
    let formData = {
      team:`${team.toUpperCase()}`,
      pos:`${position}`,
      week:`${week}`,
      year: moment().format('YYYY'),
    }
    request.post({url:url, form: formData}, (err, response, body) => {
      if (err && response.statusCode !== 200) {
        reject(err);
      }
      let array = []; 
      const $ = cheerio.load(body);
      const rows = $('#dataTable').find('tr');
      for (let i = 0; i < rows.length; i++) {
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
      let unique = removeDuplicates(array);
      unique.sort((a,b) => {
        return (Number((b.match(/(\d+)/g)[0])) - Number(a.match(/(\d+)/g)[0]));
      });

      // player, team, position, started, total snaps, offsnaps, off snap pct, def snaps, def snap pct, st snaps, st snap pct
      if (array.length === 0) {
        reject('No data available. Try again later.');
      } else {
        resolve(unique);
      }
    });
  });

};
