﻿const request = require('request');
const cheerio = require('cheerio');
const querystring = require('querystring');
const utilities = require('./utilities.js');

// There are some players where there are multiple NFL players.
// We're jerks, but we only care about the famous ones. This is an
// exceptions list so we make sure we get the one that's important.

const playerExceptions = [
  { name: 'david johnson', url: 'http://rotoworld.com/player/nfl/10404/david-johnson' },
  { name: 'brandon marshall', url: 'http://rotoworld.com/player/nfl/3653/brandon-marshall' },
  { name: 'adrian peterson', url: 'http://rotoworld.com/player/nfl/4169/adrian-peterson' },
  { name: 'michael thomas', url: 'http://rotoworld.com/player/nfl/11222/michael-thomas' },
  { name: 'mike williams', url: 'http://rotoworld.com/player/nfl/12183/mike-williams' },
  { name: 'jonathan williams', url: 'http://rotoworld.com/player/nfl/11405/jonathan-williams' },
  { name: 'kevin white', url: 'http://rotoworld.com/player/nfl/10427/kevin-white' },
  { name: 'taiwan jones', url: 'http://rotoworld.com/player/nfl/6499/taiwan-jones' },
  { name: 'alex smith', url: 'http://rotoworld.com/player/nfl/3119/alex-smith' },
  { name: 'zzz', url: 'http://rotoworld.com/player/nfl/3119/alex-smith' },
  { name: 'shady', url: 'http://rotoworld.com/player/nfl/5168/lesean-mccoy' },
  { name: 'christian mccaffrey', url: 'http://rotoworld.com/player/nfl/12198/christian-mccaffrey' },
  { name: 'jonathan stewart', url: 'http://rotoworld.com/player/nfl/4650/jonathan-stewart' },
  { name: 'devin smith', url: 'http://rotoworld.com/player/nfl/10423/devin-smith' },
  { name: 'buck allen', url: 'http://www.rotoworld.com/player/nfl/10314/buck-allen' },
  { name: 'marvin jones', url: 'http://www.rotoworld.com/player/nfl/7503/marvin-jones' },
  { name: 'matt jones', url: 'http://www.rotoworld.com/player/nfl/10493/matt-jones' },
  { name: 'cordarrelle patterson', url: 'http://www.rotoworld.com/player/nfl/8327/cordarrelle-patterson' },
  { name: 'ryan mathews', url: 'http://www.rotoworld.com/player/nfl/5603/ryan-mathews' },
  { name: 'cam newton', url: 'http://www.rotoworld.com/player/nfl/6491/cam-newton' },
  { name: 'deandre washington', url: 'http://www.rotoworld.com/player/nfl/11446/deandre-washington' },
  { name: 'odb', url: 'http://www.rotoworld.com/player/nfl/9403/odell-beckham' },
  { name: 'obj', url: 'http://www.rotoworld.com/player/nfl/9403/odell-beckham' },
  { name: 'big ben', url: 'http://www.rotoworld.com/player/nfl/1181/ben-roethlisberger' },
  { name: 'ben roethlisberger', url: 'http://www.rotoworld.com/player/nfl/1181/ben-roethlisberger' },
  { name: 'chris johnson', url: 'http://www.rotoworld.com/player/nfl/4743/chris-johnson' },
  { name: 'austin seferian-jenkins', url: 'http://www.rotoworld.com/player/nfl/9400/austin-seferian-jenkins' },
  { name: 'austin seferian jenkins', url: 'http://www.rotoworld.com/player/nfl/9400/austin-seferian-jenkins' },
  { name: 'asj', url: 'http://www.rotoworld.com/player/nfl/9400/austin-seferian-jenkins' },
];

exports.getPlayer = playerName => new Promise((resolve, reject) => {
  // declare some variables
  let url = '';
  let playerQueryFirst = '';
  let playerQueryLast = '';
  let playerSearch = '';

  // Our player search is based on no comma, so reorder if there's a comma
  // We still need the parts separated out in case we need to build the string.
  const { firstName, lastName, first_space_last } = utilities
    .standardizePlayerName(playerName);

    // Do a query to find the closest player in our database
  let playerObject = utilities.findPlayer(first_space_last);

  // Let's check to see if this player is in the player exceptions list. If we
  // didn't find anyone, it's worth checking if this player's in there all the same.
  if (playerObject && Object.keys(playerObject).length !== 0) {
    playerSearch = playerObject.fullname.toLowerCase();
  } else {
    playerSearch = playerName.toLowerCase();
  }
  const getPlayerExceptions = playerExceptions
    .filter(value => value.name.toLowerCase() === playerSearch);

    // If they are in the exception list, use it!
  if (getPlayerExceptions.length > 0) {
    url = getPlayerExceptions[0].url;
  } else {
    // If we have a player object, use the first name and last name from there.
    // Otherwise, use the string and pray.
    if (playerObject && Object.keys(playerObject).length !== 0) {
      playerQueryFirst = playerObject.first;
      playerQueryLast = playerObject.last;
    } else {
      playerQueryFirst = firstName;
      playerQueryLast = lastName;
    }
    const playerQuery = querystring.stringify({ searchname: `${playerQueryLast},${playerQueryFirst}` });
    url = `http://www.rotoworld.com/content/playersearch.aspx?${playerQuery}&sport=nfl`;
  }

  request(url, (error, response, html) => {
    if (error) { reject(error); }

    if (response.request.uri.pathname.startsWith('/content')) {
      // This means there was no player, so return false.
      reject('There is no player found with that name.');
    } else {
      // Woo, we have a player! Let's break him into little bits.
      const $ = cheerio.load(html);
      playerObject = {
        url: response.request.uri.href,
        name: '',
        position: '',
        number: '',
        team: '',
        age: '',
        heightWeight: '',
        college: '',
        drafted: '',
        latestNews: '',
        latestImpact: '',
        playerPhoto: '',
      };

      const playerHeader = $('.playerdetails').find('H1').text().split(' | ');
      playerObject.name = playerHeader[0];
      playerObject.position = playerHeader[1];
      playerObject.number = playerHeader[2];

      playerObject.team = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(1)').children().last().text();
      playerObject.heightWeight = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(3)').children().last().text();
      playerObject.college = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(4)').children().last().text();
      playerObject.drafted = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(5)').children().last().text();

      const ageDOB = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(2)').children().last().text();
      const ageDOBregExp = /\(([^)]+)\)/;
      const ageDOBmatches = ageDOBregExp.exec(ageDOB);
      playerObject.age = ageDOBmatches[1];

      playerObject.latestNews = $('.playernews').first().children('.report').text();
      playerObject.latestImpact = $('.playernews').first().children('.impact').text();
      playerObject.playerPhoto = $('.playerphoto IMG').attr('src');
      playerObject.message = `${playerObject.name}: ${playerObject.latestNews}\r\n\r\n${playerObject.latestImpact}`;
      resolve(playerObject);
    }
  });
});
