const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
exports.getTier = (position, scoring) => {
    scoringLookup = {
      'standard': {
        'qb':'http://www.borischen.co/p/quarterback-tier-rankings.html',
        'rb':'http://www.borischen.co/p/running-back-tier-rankings.html',
        'wr':'http://www.borischen.co/p/wide-receiver-tier-rankings.html',
        'te':'http://www.borischen.co/p/tight-end-tier-rankings.html',
        'k': 'http://www.borischen.co/p/kicker-tier-rankings.html',
        'dst':'http://www.borischen.co/p/defense-dst-tier-rankings.html'
      },
      'half': {
        'qb': 'http://www.borischen.co/p/quarterback-tier-rankings.html',
        'rb':'http://www.borischen.co/p/half-05-5-ppr-running-back-tier-rankings.html',
        'wr':'http://www.borischen.co/p/half-05-5-ppr-wide-receiver-tier.html',
        'te':'http://www.borischen.co/p/half-05-5-ppr-tight-end-tier-rankings.html',        
        'k': 'http://www.borischen.co/p/kicker-tier-rankings.html',
        'dst':'http://www.borischen.co/p/defense-dst-tier-rankings.html'
      },
      'full': {
        'qb': 'http://www.borischen.co/p/quarterback-tier-rankings.html',
        'rb':'http://www.borischen.co/p/ppr-running-back-tier-rankings.html',
        'wr':'http://www.borischen.co/p/ppr-wide-receiver-tier-rankings.html',
        'te':'http://www.borischen.co/p/blog-page.html',        
        'k': 'http://www.borischen.co/p/kicker-tier-rankings.html',
        'dst':'http://www.borischen.co/p/defense-dst-tier-rankings.html'
      },
    }
    return new Promise((resolve, reject) => {
        let url = scoringLookup[scoring][position];
        request(url, (error, response, body) => {         
          if (error && response.statusCode !== 200) {
            reject(error);
          }
          let $ = cheerio.load(body);
          let aws = $('.separator').next().children().attr('data');
          request.get(aws, (error, response, string) => {
            if(error && response.statusCode !== 200) {
              reject('AWS text file not working.');
            } else {
              let tiers = string.replace(/\n/g, '').split('Tier');
              let embed = {
                "embed": {
                  "title": `Boris ${position.toUpperCase()} tiers`,
                  "color": 11913417,
                  "url": url,
                  "thumbnail":{"url":'https://s3-us-west-1.amazonaws.com/fftiers/out/weekly-ALL-HALF-PPR-adjust0.png'},
                  "fields": [],
                }          
              };              
              tiers.shift();
              tiers.forEach(item => {
                let tierNumber = item.split(':')[0];
                let nameList = item.split(':')[1].slice(1, item.split(':')[1].length);
                embed.embed.fields.push({"name":`Tier${tierNumber}`, "value":`${nameList}`, "inline":true})
              });
              resolve(embed);
            }
          });
        });
    });
}