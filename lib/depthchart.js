const request = require('request');
const cheerio = require('cheerio');
const teamLookup = require('../stats/teamLookup.json');

const getDepthChart = (ros, posLookup, body) => {
  const $ = cheerio.load(body);
  const row1 = $('.row1');
  const row2 = $('.row2');
  for (let i = 2; i < row1.length; i += 1) {
    const players = [];
    const posLookupKey = $(row1[i])
      .children()
      .first()
      .text()
      .toLowerCase();
    const pos = posLookup[posLookupKey];
    $(row1[i]).children('td').find('a').each(function addPlayer() {
      const data = $(this);
      if (data.text() !== '') {
        players.push(data.text());
      }
      return true;
    });
    if (pos) {
      players.forEach((name) => {
        ros[pos].push(name);
      });
    }
  }
  for (let i = 0; i < row2.length; i += 1) {
    const players = [];
    const posLookupKey = $(row2[i])
      .children()
      .first()
      .text()
      .toLowerCase();
    const pos = posLookup[posLookupKey];
    $(row2[i]).children('td').find('a').each(function addPlayer() {
      if ($(this).text() !== '') {
        players.push($(this).text());
      }
      return true;
    });
    if (pos) {
      players.forEach((name) => {
        ros[pos].push(name);
      });
    }
  }

  Object.keys(ros).forEach((element) => {
    if (ros[element].length === 0) {
      ros[element].push('None Listed');
    }
    return true;
  });

  return ros;
};

const getKey = (obj, val) => Object.keys(obj).find(key => obj[key] === val);

exports.getRoster = (teamname, position) => {
  let teamAbbreviation = teamname;
  const team = teamLookup[teamname].name.toLowerCase();
  const mascot = team.split(' ').pop();
  const city = team.split(' ').join('-');

  // special case for jacksonville using cbssports
  if (teamname === 'JAX') {
    teamAbbreviation = 'JAC';
  }
  //https://www.cbssports.com/nfl/teams/BUF/buffalo-bills/depth-chart/
  return new Promise((resolve, reject) => {
    const url = `https://www.cbssports.com/nfl/teams/depth-chart/${teamAbbreviation}/${city}-${mascot}/depth-chart/`;
    const roster = { qb: [],
      rb: [],
      fb: [],
      wr: [],
      te: [],
      lt: [],
      lg: [],
      c: [],
      rg: [],
      rt: [],
      ldt: [],
      lde: [],
      ndt: [],
      rdt: [],
      rde: [],
      mlb: [],
      slb: [],
      wlb: [],
      rcb: [],
      lcb: [],
      ss: [],
      fs: [],
      p: [],
      ls: [],
      h: [],
      k: [],
      kr: [],
      pr: [] };
    const positionLookup = { quarterback: 'qb',
      'running back': 'rb',
      'full back': 'fb',
      'wide receiver': 'wr',
      'tight end': 'te',
      kicker: 'k',
      'kick returner': 'kr',
      'punt returner': 'pr',
      'left tackle': 'lt',
      'left guard': 'lg',
      center: 'c',
      'right guard': 'rg',
      'right tackle': 'rt',
      'left defensive tackle': 'ldt',
      'left defensive end': 'lde',
      'nose tackle': 'ndt',
      'right defensive tackle': 'rdt',
      'right defensive end': 'rde',
      'middle linebacker': 'mlb',
      'strongside linebacker': 'slb',
      'weakside linebacker': 'wlb',
      'right cornerback': 'rcb',
      'left cornerback': 'lcb',
      'strong safety': 'ss',
      'free safety': 'fs',
      punter: 'p',
      'long snapper': 'ls',
      holder: 'h' };
    request(url, (error, response, body) => {
      if (error && response.statusCode !== 200) {
        reject(error);
      }

      const results = {};
      results.roster = getDepthChart(roster, positionLookup, body);
      results.logo = teamLookup[teamname].logo;
      results.teamname = teamLookup[teamname].name;
      results.url = url;
      results.positionName = getKey(positionLookup, position);
      resolve(results);
    });
  });
};

