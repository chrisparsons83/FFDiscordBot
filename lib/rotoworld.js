const request = require('request');
const cheerio = require('cheerio');
const querystring = require('querystring');

exports.getPlayer = function (playerName) {
    return new Promise(function (resolve, reject) {
        // Let's parse the player name because Rotoworld wants it lastname,%20firstname (note the space encoding)
        if (playerName.indexOf(',') == -1) {
            let [firstName, ...lastName] = playerName.toString().split(" ").slice(0);
            playerName = lastName + ', ' + firstName;
        }
        // Sanity check
        playerQuery = querystring.stringify({ searchname: playerName });

        // Okay, now that we have a valid name, we can request this from Rotoworld
        let url = 'http://www.rotoworld.com/content/playersearch.aspx?' + playerQuery + '&sport=nfl';
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
                $('.playerdetails').filter(function () {
                    let data = $(this);

                    // Split out data in header
                    let playerHeader = data.find('H1').text().split(" | ");
                    playerObject.name = playerHeader[0];
                    playerObject.position = playerHeader[1];
                    playerObject.number = playerHeader[2];
                    playerObject.team = $('TABLE TR:nth-child(1)', this).children().last().text();

                    // Filter out age
                    let ageDOB = $('TABLE TR:nth-child(2)', this).children().last().text();
                    let ageDOBregExp = /\(([^)]+)\)/;
                    let ageDOBmatches = ageDOBregExp.exec($('TABLE TR:nth-child(2)', this).children().last().text());
                    playerObject.age = ageDOBmatches[1];

                    // Height/weight, college, drafted are easy
                    playerObject.heightWeight = $('TABLE TR:nth-child(3)', this).children().last().text();
                    playerObject.college = $('TABLE TR:nth-child(4)', this).children().last().text();
                    playerObject.drafted = $('TABLE TR:nth-child(5)', this).children().last().text();
                });

                // Time for the latest news!
                $('.playernews').each(function () {
                    let data = $(this);
                    playerObject.latestNews = $('.report', this).text();
                    playerObject.latestImpact = $('.impact', this).text();
                    return false;
                });
                playerObject.playerPhoto = $('.playerphoto IMG').attr('src');
                playerObject.message = playerObject.name + ': ' + playerObject.latestNews + '\r\n\r\n' + playerObject.latestImpact;
                resolve(playerObject);
            }
        });
    });
}