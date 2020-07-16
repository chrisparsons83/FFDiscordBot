﻿const puppeteer = require('puppeteer');

// There are some players where there are multiple NFL players.
// We're jerks, but we only care about the famous ones. This is an
// exceptions list so we make sure we get the one that's important.

const playerExceptions = [
  { name: 'david johnson', id: 230, urlName: 'david-johnson' },
  { name: 'brandon marshall', id: 11670, urlName: 'brandon-marshall' },
  { name: 'adrian peterson', id: 12700, urlName: 'adrian-peterson' },
  { name: 'michael thomas', id: 10152, urlName: 'michael-thomas' },
  { name: 'mike williams', id: 9037, urlName: 'mike-williams' },
  { name: 'jonathan williams', id: 10216, urlName: 'jonathan-williams' },
  { name: 'kevin white', id: 1419, urlName: 'kevin-white' },
  { name: 'taiwan jones', id: 886, urlName: 'taiwan-jones' },
  { name: 'alex smith', id: 12669, urlName: 'alex-smith' },
  { name: 'zzz', id: 12669, urlName: 'alex-smith' },
  { name: 'shady', id: 937, urlName: 'lesean-mccoy' },
  { name: 'jonathan stewart', id: 10462, urlName: 'jonathan-stewart' },
  { name: 'devin smith', id: 7405, urlName: 'devin-smith' },
  { name: 'buck allen', id: 636, urlName: 'javorius-allen' },
  { name: 'marvin jones', id: 2683, urlName: 'marvin-jones' },
  { name: 'matt jones', id: 1523, urlName: 'matt-jones' },
  { name: 'cam newton', id: 1185, urlName: 'cam-newton' },
  { name: 'odb', id: 10466, urlName: 'odell-beckham' },
  { name: 'obj', id: 10466, urlName: 'odell-beckham' },
  { name: 'big ben', id: 11408, urlName: 'ben-roethlisberger' },
  { name: 'chris johnson', id: 7177, urlName: 'chris-johnson' },
  { name: 'austin seferian jenkins', id: 8584, urlName: 'austin-seferian-jenkins' },
  { name: 'asj', id: 8584, urlName: 'austin-seferian-jenkins' },
  { name: 'chris thompson', id: 12710, urlName: 'chris-thompson' },
  { name: 'gronk', id: 9962, urlName: 'rob-gronkowski' },
  { name: 'benjamin watson', id: 10215, urlName: 'ben-watson' },
  { name: 'charles clay', id: 940, urlName: 'charles-clay' },
  { name: 'juju smith schuster', id: 11412, urlName: 'juju-smith-schuster' },
  { name: 'trashcan', id: 1185, urlName: 'cam-newton' },
  { name: 'trashcam', id: 1185, urlName: 'cam-newton' },
  { name: 'dougie fresh', id: 10961, urlName: 'doug-martin' },
  { name: 'douggernaut', id: 10961, urlName: 'doug-martin' },
  { name: 'dmcutsemoji', id: 10961, urlName: 'doug-martin' },
  { name: 'tygod', id: 1869, urlName: 'tyrod-taylor' },
  { name: 'josh allen', id: 944, urlName: 'josh-allen' },
  { name: 'christian kirk', id: 234, urlName: 'christian-kirk' },
  // { name: 'justin jackson', id: 9046, urlName: 'justin-jackson' },
];

exports.getPlayer = async (playerName) => {
  // First, we need to figure out the URL to use
  // We have some name issues. In the future we may be able to look at the page in question that's
  // being loaded and figure out the correct player, or we manage these URLs in an actual
  // database, crazy!
  let url = `https://www.rotoworld.com/search/nfl#query=${playerName.toLowerCase()}`;
  const getPlayerExceptions = playerExceptions.filter(
    value => value.name.toLowerCase() === playerName.toLowerCase(),
  );
  if (getPlayerExceptions.length > 0) {
    url = `https://www.rotoworld.com/football/nfl/player/${getPlayerExceptions[0].id}/${
      getPlayerExceptions[0].urlName
    }`;
  }

  // We're only using puppeteer here because Rotoworld is now basically a SPA
  // and is loading content via javascript. This is way slower than just using
  // request, but it's the only way it will work.
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Because rotoworld does some funny redirecting, we have to wait for the page
  // to actually load the content we care about
  await page.goto(url);
  await page.waitFor('.player-highlight__player-first, .search__status__result', { timeout: 5000 });

  // TODO: Figure out how to error handle a timeout here

  page.on('console', (msg) => {
    for (let i = 0; i < msg.args().length; i += 1) {
      console.log(`${i}: ${msg.args()[i]}`);
    }
  });

  const playerObject = await page.evaluate(() => {
    // If we have a multiple name situation, catch it here and reject
    try {
      const searchBox = document.querySelector('.player-highlight__player-first').innerText;
    } catch (error) {
      // The brackets will suppress the URL embed.
      throw `There was an issue loading this player. If there are multiple players listed on <${location.href}>, then an exception needs to be made for this player.`;
    }

    // Get first name and last name because we want them joined together.
    const firstName = document.querySelector('.player-highlight__player-first').innerText;
    const lastName = document.querySelector('.player-highlight__player-last').innerText;

    // Get path for image for player
    const playerImagePath = document
      .querySelector('.player-highlight__player-photo IMG')
      .getAttribute('src');

    // Return our player object
    return {
      url: location.href,
      name: `${firstName} ${lastName}`,
      position: document.querySelector('.player-highlight__player-position').innerText,
      number: document.querySelector('.player-highlight__player-number').innerText,
      team: document.querySelector('.player-highlight__team-name').innerText,
      age: document.querySelector('.player-details TR:nth-child(1) TD:last-child').innerText,
      heightWeight: document.querySelector('.player-details TR:nth-child(2) TD:last-child')
        .innerText,
      college: document.querySelector('.player-details TR:nth-child(3) TD:last-child').innerText,
      drafted: document.querySelector('.player-details TR:nth-child(4) TD:last-child').innerText,
      latestNews: document.querySelectorAll('.player-content__wrapper .player-news-article__title')[0].innerText,
      latestImpact: document.querySelectorAll('.player-content__wrapper .player-news-article__summary')[0].innerText,
      playerPhoto: `https://www.rotoworld.com${playerImagePath}`,
    };
  });

  browser.close();

  return playerObject;
};
