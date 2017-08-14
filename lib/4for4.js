const request = require('request');
const cheerio = require('cheerio');

exports.getADP = (playerName) => {
    return new Promise((resolve, reject) => {
        let url = 'https://www.4for4.com/fantasy-football/adp?paging=0';
        let playerObject = {
            Name: '',
            Team: '',
            LastUpdated: '',
            ADP: {
                'Yahoo': 0,
                'ESPN': 0,
                'MFL': 0,
                'NFL': 0
            }
        };

        request(url, (error, response, html) => {
            if (error && response.statusCode !== 200) reject(error);

            let $ = cheerio.load(html);

            $('EM').each(function(i, element){
                let data = $(this);
                if (data.text().indexOf('Last updated') !== -1) {
                    playerObject.LastUpdated = data.text().substring(13);
                    return true;
                }
            });

            $('TR.odd, TR.even').each(function(i, element){
                let player = $(this).children().first().next();
                if (player.text().toUpperCase() !== playerName.toUpperCase()) return true;
                playerObject.name = player.text();

                // Get Team
                let team = player.next();
                playerObject.Team = player.next().text();

                // Get ADP
                playerObject.ADP.ESPN = parseInt(team.next().next().next().next().text());
                playerObject.ADP.MFL = parseInt(team.next().next().next().next().next().next().text());
                playerObject.ADP.NFL = parseInt(team.next().next().next().next().next().next().next().text());
                playerObject.ADP.Yahoo = parseInt(team.next().next().next().next().next().next().next().next().text());

                resolve(playerObject);
            });

            reject("No player found. Please check your spelling, or he may be outside the top 300.");
        });
    });
}