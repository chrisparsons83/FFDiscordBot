const request = require('request');
const cheerio = require('cheerio');
const querystring = require('querystring');
const utilities = require('./utilities.js');

// There are some players where there are multiple NFL players.
// We're jerks, but we only care about the famous ones. This is an
// exceptions list so we make sure we get the one that's important.

const playerExceptions = [
    { name: 'Johnson,David', url: 'http://www.rotoworld.com/player/nfl/10404/david-johnson' },
    { name: 'Marshall,Brandon', url: 'http://www.rotoworld.com/player/nfl/3653/brandon-marshall' },
    { name: 'Peterson,Adrian', url: 'http://www.rotoworld.com/player/nfl/4169/adrian-peterson' },
    { name: 'Thomas,Michael', url: 'http://www.rotoworld.com/player/nfl/11222/michael-thomas'},
    { name: 'Williams,Mike', url: 'http://www.rotoworld.com/player/nfl/12183/mike-williams'},
    { name: 'Williams,Jonathan', url:'http://www.rotoworld.com/player/nfl/11405/jonathan-williams'},
    { name: 'White,Kevin', url:'http://www.rotoworld.com/player/nfl/10427/kevin-white'},
];

exports.getPlayer = function (playerName) {
    console.log(playerName)
    return new Promise(function (resolve, reject) {
        let url = '';
        // Let's parse the player name because Rotoworld wants it lastname,firstname (note the space encoding)
        if (playerName.indexOf(',') === -1) {
            let [firstName, ...lastName] = playerName.toString().split(" ").slice(0);
            playerName = lastName + ',' + firstName;
        }
        // Let's see if we have a player in the player exception list, otherwise we can just search as normal.
        getPlayerExceptions = playerExceptions.filter(function (value) {
            // making sure it isn't case sensitive for player exceptions
            return value.name.toLowerCase() == playerName.toLowerCase();
        });
        if (getPlayerExceptions.length === 1) {
            url = getPlayerExceptions[0].url;
        }
        else {
            // split the query into firstname, lastname
            let firstname = playerName.split(',')[1];
            let lastname = playerName.split(',')[0];
            // use fuzzy matching utility
            let result = utilities.findName(`${firstname} ${lastname}`);
            // if result isn't an object, that means we find a match within it's threshold 
            if (result) {
              // Formatting the player name to fit within a URL query.
              playerQuery = querystring.stringify({ searchname: `${result.last},${result.first}`});
            } else {
              // search for the player anyway in it's not in the player db and hope the person spelled the name right
              playerQuery = querystring.stringify({ searchname: playerName});
            }
            

            url = 'http://www.rotoworld.com/content/playersearch.aspx?' + playerQuery + '&sport=nfl';

        }
        request(url, function (error, response, html) {
            if (error) { reject(error); }

            if (response.request.uri.pathname.startsWith('/content')) {
                // This means there was no player, so return false.
                reject("There is no player found with that name.");
            } else {
                // Woo, we have a player! Let's break him into little bits.
                let $ = cheerio.load(html);
                let playerObject = {
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
                    playerPhoto: ''
                }

                let playerHeader = $('.playerdetails').find('H1').text().split(" | ");
                playerObject.name = playerHeader[0];
                playerObject.position = playerHeader[1];
                playerObject.number = playerHeader[2];

                playerObject.team = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(1)').children().last().text();
                playerObject.heightWeight = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(3)').children().last().text();
                playerObject.college = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(4)').children().last().text();
                playerObject.drafted = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(5)').children().last().text();

                let ageDOB = $('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(2)').children().last().text();
                let ageDOBregExp = /\(([^)]+)\)/;
                let ageDOBmatches = ageDOBregExp.exec($('TABLE#cp1_ctl00_tblPlayerDetails TR:nth-child(2)').children().last().text());
                playerObject.age = ageDOBmatches[1];

                playerObject.latestNews = $('.playernews').first().children('.report').text();
                playerObject.latestImpact = $('.playernews').first().children('.impact').text();
                playerObject.playerPhoto = $('.playerphoto IMG').attr('src');
                playerObject.message = playerObject.name + ': ' + playerObject.latestNews + '\r\n\r\n' + playerObject.latestImpact;
                resolve(playerObject);
            }
        });
    });
}