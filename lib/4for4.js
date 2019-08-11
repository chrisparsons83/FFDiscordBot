const request = require('request');
const cheerio = require('cheerio');
const fuzzy = require('fuzzy-string-matching');
const utilities = require('./utilities');
const config = require('.././config');


exports.getADP = string => new Promise((resolve, reject) => {
  const fuzzyObject = utilities.findPlayer(string);
  let playerName;
  // If we have a player, then let's use that actual name
  // Otherwise, we can hope the player is real and just not on the list.
  if (fuzzyObject) {
    // only strip the single quote mark from name
    playerName = fuzzyObject.fullname.replace('\'', '')
  } else {
    playerName = string.replace('\'', '')
  }
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

    // Grab the last updated date
    let lastUpdatedText = $('.last-update').children().text();
    if (lastUpdatedText.toLowerCase().indexOf('last updated') !== -1) {
      let text = lastUpdatedText.substring(13);
      let dateFormatted = text.split(',').splice(1).map(str => str.trim()).join(', ')
      playerObject.LastUpdated = dateFormatted
    }

    // Loop through each player, and see if it's the player we're looking for
    console.log('--> ' + config.playerNameFuzzyTolerance);
    $('TR.odd, TR.even').each(function scanRows() {
      const player = $(this).children().first().next();
      // If this isn't the player we want, just move to the next row.
      if (fuzzy(player.text(), playerName) * 100 < 75){
        return true;
      } 

      // Otherwise, let's add them to the object!
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

    reject('No player found. Please check your spelling, or he may be outside the top 250.');
  });
});
