const request = require('request');
const cheerio = require('cheerio');

exports.getADP = playerName => new Promise((resolve, reject) => {
  const url = 'https://www.4for4.com/fantasy-football/adp?paging=0';
  const playerObject = {
    Name: '',
    Team: '',
    LastUpdated: '',
    ADP: {
      Yahoo: 0,
      ESPN: 0,
      MFL: 0,
      NFL: 0,
    },
  };

  request.get(url, (error, response, html) => {
    if (error && response.statusCode !== 200) reject(error);

    const $ = cheerio.load(html);

    $('EM').each(function lastUpdated() {
      const data = $(this);
      if (data.text().indexOf('Last updated') !== -1) {
        playerObject.LastUpdated = data.text().substring(13);
        return false;
      }
      return true;
    });

    $('TR.odd, TR.even').each(function scanRows() {
      const player = $(this).children().first().next();
      if (player.text().toUpperCase() !== playerName.toUpperCase()) return true;
      playerObject.name = player.text();

      // Get Team
      const team = player.next();
      playerObject.Team = player.next().text();

      // Get ADP
      // eq() is zero-indexed, so .nextAll().eq(3) == .next() chained four times.
      playerObject.ADP.ESPN = parseInt(team.nextAll().eq(3).text(), 10);
      playerObject.ADP.MFL = parseInt(team.nextAll().eq(5).text(), 10);
      playerObject.ADP.NFL = parseInt(team.nextAll().eq(6).text(), 10);
      playerObject.ADP.Yahoo = parseInt(team.nextAll().eq(7).text(), 10);

      resolve(playerObject);
      return false;
    });

    reject('No player found. Please check your spelling, or he may be outside the top 300.');
  });
});
