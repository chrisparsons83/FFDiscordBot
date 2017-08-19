﻿const request = require('request');
const cheerio = require('cheerio');
const querystring = require('querystring');
const utilities = require('./utilities.js');

// There are some players where there are multiple NFL players.
// We're jerks, but we only care about the famous ones. This is an
// exceptions list so we make sure we get the one that's important.

const playerExceptions = [
    { name: 'david johnson', url: 'http://www.rotoworld.com/player/nfl/10404/david-johnson' },
    { name: 'brandon marshall', url: 'http://www.rotoworld.com/player/nfl/3653/brandon-marshall' },
    { name: 'adrian peterson', url: 'http://www.rotoworld.com/player/nfl/4169/adrian-peterson' },
    { name: 'michael thomas', url: 'http://www.rotoworld.com/player/nfl/11222/michael-thomas'},
    { name: 'mike williams', url: 'http://www.rotoworld.com/player/nfl/12183/mike-williams'},
    { name: 'jonathan williams', url:'http://www.rotoworld.com/player/nfl/11405/jonathan-williams'},
    { name: 'kevin white', url:'http://www.rotoworld.com/player/nfl/10427/kevin-white'},
    { name: 'taiwan jones', url:'http://www.rotoworld.com/player/nfl/6499/taiwan-jones'},
    { name: 'alex smith', url:'http://rotoworld.com/player/nfl/3119/alex-smith'},
];

exports.getPlayer = function (playerName) {
    return new Promise(function (resolve, reject) {
        // declare some variables
        let url, playerStringQuery, playerQueryFirst, playerQueryLast = '';

        // Our player search is based on no comma, so reorder if there's a comma
        // We still need the parts separated out in case we need to build the string.
        let {firstName, lastName, first_space_last} = utilities.standardizePlayerName(playerName);

        // Do a query to find the closest player in our database
        let playerObject = utilities.findPlayer(first_space_last);

        // Let's check to see if this player is in the player exceptions list
        // We only want to do this with players we found, because we're only having
        // players in the exception list that are clearly in the database. It feels
        // safe to make this assumption, but this may be incorrect.
        if (playerObject && Object.keys(playerObject).length !== 0) {
            getPlayerExceptions = playerExceptions.filter((value) => {
                // making sure it isn't case sensitive for player exceptions
                return value.name.toLowerCase() === playerObject.fullname.toLowerCase();
            });
        }

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
            playerQuery = querystring.stringify({searchname: `${playerQueryLast},${playerQueryFirst}`});
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