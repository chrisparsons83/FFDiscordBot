const request = require('request');
const cheerio = require('cheerio');
const utilities = require("./utilities.js");


exports.getDriveStats = (teamname) => {
  return new Promise((resolve, reject) => {

    let url = `https://www.footballoutsiders.com/stats/nfl/overall-drive-statsoff/2020`;

    request.get(url, (err, response, body) => {
      if (err && response.statusCode !== 200) {
        reject(err);
      }
      const $ = cheerio.load(body);
      const rows = $('table').find('tr');
      const data = {};
      data.name = teamname;
      data.team = {}
      data.league = {};
      //first table
      for (let i = 1; i <= 33; i++) {
        const team = $(rows[i]).children('td:nth-child(1)').text();
        if (team.toLowerCase() === 'avg') {
          data.league.total_drive = $(rows[i]).children('td:nth-child(2)').text();
          data.league.yards_per_drive = $(rows[i]).children('td:nth-child(3)').text();
          data.league.points_per_drive = $(rows[i]).children('td:nth-child(5)').text();
          data.league.to_per_drive = (parseFloat($(rows[i]).children('td:nth-child(7)').text())*100).toFixed(2);
          data.league.int_per_drive = (parseFloat($(rows[i]).children('td:nth-child(9)').text())*100).toFixed(2);
          data.league.fumble_per_drive = (parseFloat($(rows[i]).children('td:nth-child(11)').text())*100).toFixed(2);
          data.league.starting_position_per_drive = $(rows[i]).children('td:nth-child(13)').text();
          data.league.plays_per_drive = $(rows[i]).children('td:nth-child(15)').text();
          data.league.top_per_drive = $(rows[i]).children('td:nth-child(17)').text();
          data.league.drive_success_rate = (parseFloat($(rows[i]).children('td:nth-child(19)').text())*100).toFixed(2);
        }
        //filter only the team requested
        if (team === teamname) {
          data.team.total_drive = $(rows[i]).children('td:nth-child(2)').text();
          data.team.yards_per_drive = $(rows[i]).children('td:nth-child(3)').text();
          data.team.yards_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(4)').text());
          data.team.points_per_drive = $(rows[i]).children('td:nth-child(5)').text();
          data.team.points_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(6)').text());
          data.team.to_per_drive = (parseFloat($(rows[i]).children('td:nth-child(7)').text())*100).toFixed(2);
          data.team.to_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(8)').text());
          data.team.int_per_drive = (parseFloat($(rows[i]).children('td:nth-child(9)').text())*100).toFixed(2);
          data.team.int_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(10)').text());
          data.team.fumble_per_drive = (parseFloat($(rows[i]).children('td:nth-child(11)').text())*100).toFixed(2);
          data.team.fumble_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(12)').text());
          data.team.avg_starting_position_per_drive = $(rows[i]).children('td:nth-child(13)').text();
          data.team.avg_starting_position_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(14)').text());
          data.team.plays_per_drive = $(rows[i]).children('td:nth-child(15)').text();
          data.team.plays_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(16)').text());
          data.team.top_per_drive = $(rows[i]).children('td:nth-child(17)').text();
          data.team.top_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(18)').text());
          data.team.drive_success_rate = (parseFloat($(rows[i]).children('td:nth-child(19)').text())*100).toFixed(2);
          data.team.drive_success_rate_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(20)').text());
        }
      }

      //second table
      for (let i = 35; i <= 67; i++) {
        const team = $(rows[i]).children('td:nth-child(1)').text()
        if (team.toLowerCase() === 'avg') {
          data.league.td_per_drive = (parseFloat($(rows[i]).children('td:nth-child(3)').text())*100).toFixed(2);
          data.league.fg_per_drive = (parseFloat($(rows[i]).children('td:nth-child(5)').text())*100).toFixed(2);
          data.league.punts_per_drive = (parseFloat($(rows[i]).children('td:nth-child(7)').text())*100).toFixed(2);
          data.league.three_and_outs_per_drive = (parseFloat($(rows[i]).children('td:nth-child(9)').text())*100).toFixed(2);
          data.league.starting_position_per_drive = $(rows[i]).children('td:nth-child(11)').text();
          data.league.td_fg_ratio = (parseFloat($(rows[i]).children('td:nth-child(13)').text())*100).toFixed(2);
          data.league.points_per_redzone = (parseFloat($(rows[i]).children('td:nth-child(15)').text())*100).toFixed(2);
          data.league.tds_per_redzone = (parseFloat($(rows[i]).children('td:nth-child(17)').text())*100).toFixed(2);
          data.league.average_lead = $(rows[i]).children('td:nth-child(19)').text();
        }
        //filter only the team requested
        if (team === teamname) {
          data.team.td_per_drive = (parseFloat($(rows[i]).children('td:nth-child(3)').text())*100).toFixed(2);
          data.team.td_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(4)').text());
          data.team.fg_per_drive = (parseFloat($(rows[i]).children('td:nth-child(5)').text())*100).toFixed(2);
          data.team.fg_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(6)').text());
          data.team.punts_per_drive = (parseFloat($(rows[i]).children('td:nth-child(7)').text())*100).toFixed(2);
          data.team.punts_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(8)').text());
          data.team.three_and_outs_per_drive = (parseFloat($(rows[i]).children('td:nth-child(9)').text())*100).toFixed(2);
          data.team.three_and_outs_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(10)').text());
          data.team.starting_position_per_drive = $(rows[i]).children('td:nth-child(11)').text();
          data.team.starting_position_per_drive_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(12)').text());
          data.team.td_fg_ratio = (parseFloat($(rows[i]).children('td:nth-child(13)').text())*100).toFixed(2);
          data.team.td_fg_ratio_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(14)').text());
          data.team.points_per_redzone = (parseFloat($(rows[i]).children('td:nth-child(15)').text())*100).toFixed(2);
          data.team.points_per_redzone_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(16)').text());
          data.team.tds_per_redzone = (parseFloat($(rows[i]).children('td:nth-child(17)').text())*100).toFixed(2);
          data.team.tds_per_redzone_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(18)').text());
          data.team.average_lead = $(rows[i]).children('td:nth-child(19)').text();
          data.team.average_lead_rank = utilities.convertOrd($(rows[i]).children('td:nth-child(20)').text());
        }
      }  
      resolve(data);
    })

  });


};
