const request = require('request');
const cheerio = require('cheerio');

const nflTeams = [
    { abbreviation: 'BUF', location: 'Buffalo', mascot: 'Bills' },
    { abbreviation: 'MIA', location: 'Miami', mascot: 'Dolphins' },
    { abbreviation: 'NE', location: 'New England', mascot: 'Patriots' },
    { abbreviation: 'NYJ', location: 'New York', mascot: 'Jets' },
    { abbreviation: 'BAL', location: 'Baltimore', mascot: 'Ravens' },
    { abbreviation: 'CIN', location: 'Cincinnati', mascot: 'Bengals' },
    { abbreviation: 'CLE', location: 'Cleveland', mascot: 'Browns' },
    { abbreviation: 'PIT', location: 'Pittsburgh', mascot: 'Steelers' },
    { abbreviation: 'HOU', location: 'Houston', mascot: 'Texans' },
    { abbreviation: 'IND', location: 'Indianapolis', mascot: 'Colts' },
    { abbreviation: 'JAX', location: 'Jacksonville', mascot: 'Jaguars' },
    { abbreviation: 'TEN', location: 'Tennessee', mascot: 'Titans' },
    { abbreviation: 'DEN', location: 'Denver', mascot: 'Broncos' },
    { abbreviation: 'KC', location: 'Kansas City', mascot: 'Chiefs' },
    { abbreviation: 'OAK', location: 'Oakland', mascot: 'Raiders' },
    { abbreviation: 'SD', location: 'San Diego', mascot: 'Chargers' },
    { abbreviation: 'DAL', location: 'Dallas', mascot: 'Cowboys' },
    { abbreviation: 'NYG', location: 'New York', mascot: 'Giants' },
    { abbreviation: 'PHI', location: 'Philadelphia', mascot: 'Eagles' },
    { abbreviation: 'WSH', location: 'Washington', mascot: 'Redskins' },
    { abbreviation: 'CHI', location: 'Chicago', mascot: 'Bears' },
    { abbreviation: 'DET', location: 'Detroit', mascot: 'Lions' },
    { abbreviation: 'GB', location: 'Green Bay', mascot: 'Packers' },
    { abbreviation: 'MIN', location: 'Minnesota', mascot: 'Vikings' },
    { abbreviation: 'ATL', location: 'Atlanta', mascot: 'Falcons' },
    { abbreviation: 'CAR', location: 'Carolina', mascot: 'Panthers' },
    { abbreviation: 'NO', location: 'New Orleans', mascot: 'Saints' },
    { abbreviation: 'TB', location: 'Tampa Bay', mascot: 'Buccaneers' },
    { abbreviation: 'ARI', location: 'Arizona', mascot: 'Cardinals' },
    { abbreviation: 'LA', location: 'Los Angeles', mascot: 'Rams' },
    { abbreviation: 'SF', location: 'San Francisco', mascot: '49ers' },
    { abbreviation: 'SEA', location: 'Seattle', mascot: 'Seahawks' },
];

exports.next5 = function (teamName) {
    return new Promise(function (resolve, reject) {
        let teamAbbreviation = '';

        let filtered = nflTeams.filter(function (value) {
            return (value.mascot == teamName) || (value.abbreviation == teamName);
        });
        if (filtered.length == 1) {
            teamAbbreviation = filtered[0].abbreviation;
            console.log(teamAbbreviation);
        } else {
            reject('Please enter a valid team.');
        }

        // Now that we have a valid team, let's go grab stuff from ESPN.
        let url = 'http://www.espn.com/nfl/team/schedule/_/name/' + teamAbbreviation;
    });
};