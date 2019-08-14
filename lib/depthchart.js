const request = require('request');
const cheerio = require('cheerio');
const utilities = require('./utilities.js');
const teamLookup = require('../stats/teamLookup.json');

const getDepthChart = (depthChart, body) => {
  // depthchart is an empty object
  const $ = cheerio.load(body);
  let lastUpdatedText = 'Last ' + $('.dc-upd').text();
  let rosterObj = {};
  
  $('TR.row-dc-wht, TR.row-dc-grey').each(function eachRow() {
    let names = []
    let validPosition = ['lwr', 'rwr', 'swr', 'rb', 'te', 'qb', 'k'];
    // get the text
    let pos = $(this).children('td:nth-child(1)').text().toLowerCase();

    let p1 = utilities.depthChartSplit($(this).children('td:nth-child(3)').text())
    let p2 = utilities.depthChartSplit($(this).children('td:nth-child(5)').text())
    let p3 = utilities.depthChartSplit($(this).children('td:nth-child(7)').text())
    let p4 = utilities.depthChartSplit($(this).children('td:nth-child(9)').text())
    let p5 = utilities.depthChartSplit($(this).children('td:nth-child(11)').text())
    // special case designation for kick, change from site pk to k
    if (pos === 'pk') {
      pos = 'k';
    }
    
    if (validPosition.includes(pos)) {
      // merge wide receivers if the position is the same
      if (pos === 'lwr' || pos === 'rwr' || pos === 'swr') {
        // push names into players array
        names.push(p1,p2,p3,p4,p5);
        // capitalize first letter of first and last name
        names = names.map(x => {
          return utilities.capitalizeFirstLetterOfName(x);
        })
        
        // check if key exist in obj 
        if (pos in rosterObj) {
          rosterObj[pos] = rosterObj[pos].concat(names);
        } else {
          rosterObj[pos] = names;
        }
       // special cases for 2 te/2 rb depth charts
      } else if (pos === 'te' || pos === 'rb') {
        let key = pos + '1'
        names.push(p1,p2,p3,p4,p5);
        names = names.map((x) => { 
          return utilities.capitalizeFirstLetterOfName(x);
        });
        // check if key exist
        if (key in rosterObj) {
          rosterObj[pos + '2'] = names;
        } else {
          rosterObj[key] = names;
        }        
      } else {
        names.push(p1,p2,p3,p4,p5);
        names = names.map(x => {
          return utilities.capitalizeFirstLetterOfName(x);
        }).filter(Boolean);
        rosterObj[pos] = names;
      }
    }
  });

  // final depth chart by merging cols
  // check if swr, rwr, and lwr are listed
  if ('swr' in rosterObj && 'rwr' in rosterObj && 'lwr' in rosterObj) {
    let lwr = rosterObj['lwr'], rwr = rosterObj['rwr'], swr = rosterObj['swr'];
    lwr.map((name, index) => {
        depthChart['wr'].push(`LWR ${name}`);
        depthChart['wr'].push(`RWR ${rwr[index]}`);
        depthChart['wr'].push(`SWR ${swr[index]}`); 
    });
    // this filters out any spots with undefined in it
    depthChart['wr'] = depthChart['wr'].filter((x) => !x.includes('undefined'));

  //some team have only rwr and swr listed
  } else if ('swr' in rosterObj && 'rwr' in rosterObj ){
    let rwr = rosterObj['rwr'], swr = rosterObj['swr'];
    rwr.map((name, index) => {
        depthChart['wr'].push(`RWR ${name}`);
        depthChart['wr'].push(`SWR ${swr[index]}`);
    });
    // this filters out any spots with undefined in it
    depthChart['wr'] = depthChart['wr'].filter((x) => !x.includes('undefined'));
  
    //some team have no swr listed
  } else {
    let lwr = rosterObj['lwr'], rwr = rosterObj['rwr'];
    lwr.map((name, index) => {
        depthChart['wr'].push(`LWR ${name}`);
        depthChart['wr'].push(`RWR ${rwr[index]}`);
    });
    // this filters out any spots with undefined in it
    depthChart['wr'] = depthChart['wr'].filter((x) => !x.includes('undefined'));
  }

  // if theres 2 starting rb
  if ('rb2' in rosterObj) {
    let rb1 = rosterObj['rb1'], rb2 = rosterObj['rb2'];
    rb1.map((name, index) => {
      depthChart['rb'].push(name);
      depthChart['rb'].push(rb2[index]);
    });
    depthChart['rb'] = depthChart['rb'].filter(Boolean);
  } else {
    depthChart['rb'] = rosterObj['rb1'].filter(Boolean);
  }

  // if theres 2 te row
  if ('te2' in rosterObj) {
    let te1 = rosterObj['te1'], te2 = rosterObj['te2'];
    te1.map((name, index) => {
      depthChart['te'].push(name);
      depthChart['te'].push(te2[index]);
    });    
    depthChart['te'] = depthChart['te'].filter(Boolean);
  } else {
    depthChart['te'] = rosterObj['te1'].filter(Boolean);
  }
  // kicker or qb

  depthChart['qb'] = rosterObj['qb'].filter(Boolean);
  depthChart['k'] = rosterObj['k'].filter(Boolean);
  depthChart['update'] = lastUpdatedText;
  
  return depthChart

};

const getKey = (obj, val) => Object.keys(obj).find(key => obj[key] === val);

exports.getRoster = (teamname, position) => {
  let teamAbbreviation = teamname.toUpperCase();
  // special case for arizone using ourlads
  if (teamname === 'ARI') {
    teamAbbreviation = 'ARZ';
  }
  return new Promise((resolve, reject) => {
    const url = `https://www.ourlads.com/nfldepthcharts/depthchart/${teamAbbreviation}`;
    const depthChart = {
      update: '',
      qb: [],
      rb: [],
      fb: [],
      wr: [],
      te: [],
      k: [] 
    };

    const positionLookup = { 
      'quarterback': 'qb',
      'running back': 'rb',
      'full back': 'fb',
      'wide receiver': 'wr',
      'tight end': 'te',
      'kicker': 'k',
      'kick returner': 'kr',
      'punt returner': 'pr',
      'left tackle': 'lt',
      'left guard': 'lg',
      'center': 'c',
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
      'punter': 'p',
      'long snapper': 'ls',
      'holder': 'h' };
    request(url, (error, response, body) => {
      if (error && response.statusCode !== 200) {
        reject(error);
      }

      const results = {};
      results.roster = getDepthChart(depthChart, body);
      results.logo = teamLookup[teamname].logo;
      results.teamname = teamLookup[teamname].name;
      results.url = url;
      results.positionName = getKey(positionLookup, position);
      resolve(results);
    });
  });
};

