const request = require('request');
const cheerio = require('cheerio');

exports.getTier = (position, scoring) => {
  const scoringLookup = {
    standard: {
      qb: 'http://www.borischen.co/p/quarterback-tier-rankings.html',
      rb: 'http://www.borischen.co/p/running-back-tier-rankings.html',
      wr: 'http://www.borischen.co/p/wide-receiver-tier-rankings.html',
      te: 'http://www.borischen.co/p/tight-end-tier-rankings.html',
      k: 'http://www.borischen.co/p/kicker-tier-rankings.html',
      dst: 'http://www.borischen.co/p/defense-dst-tier-rankings.html',
      flex: 'http://www.borischen.co/p/flex-tier-rankings.html',
    },
    half: {
      qb: 'http://www.borischen.co/p/quarterback-tier-rankings.html',
      rb: 'http://www.borischen.co/p/half-05-5-ppr-running-back-tier-rankings.html',
      wr: 'http://www.borischen.co/p/half-05-5-ppr-wide-receiver-tier.html',
      te: 'http://www.borischen.co/p/half-05-5-ppr-tight-end-tier-rankings.html',
      k: 'http://www.borischen.co/p/kicker-tier-rankings.html',
      dst: 'http://www.borischen.co/p/defense-dst-tier-rankings.html',
      flex: 'http://www.borischen.co/p/05-half-ppr-flex-tier-rankings.html',
    },
    full: {
      qb: 'http://www.borischen.co/p/quarterback-tier-rankings.html',
      rb: 'http://www.borischen.co/p/ppr-running-back-tier-rankings.html',
      wr: 'http://www.borischen.co/p/ppr-wide-receiver-tier-rankings.html',
      te: 'http://www.borischen.co/p/blog-page.html',
      k: 'http://www.borischen.co/p/kicker-tier-rankings.html',
      dst: 'http://www.borischen.co/p/defense-dst-tier-rankings.html',
      flex: 'http://www.borischen.co/p/all-data-are-from-fantasypros.html',
    },
  };
  return new Promise((resolve, reject) => {
    const url = scoringLookup[scoring][position];
    request(url, (error, response, body) => {
      if (error || !response.statusCode || response.statusCode !== 200) {
        reject(error);
      }
      const $ = cheerio.load(body);
      const aws = $('.separator').next().children().attr('data');
      request.get(aws, (tiersError, tiersResponse, string) => {
        if (tiersError || tiersResponse.statusCode !== 200) {
          reject('Boris AWS text file not working.');
        } else {
          const object = {};
          const tiers = string.replace(/\n/g, '').split('Tier');
          tiers.shift();
          object.string = tiers;
          object.position = position.toUpperCase();
          object.url = url;
          object.thumbnail = 'https://s3-us-west-1.amazonaws.com/fftiers/out/weekly-ALL-HALF-PPR-adjust0.png';
          resolve(object);
        }
      });
    });
  });
};
