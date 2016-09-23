const request = require('request');
const cheerio = require('cheerio');

const nflTeams = {
    'BUF': { location: 'Buffalo', mascot: 'Bills' },
    'MIA': { location: 'Miami', mascot: 'Dolphins' },
    'NE': { location: 'New England', mascot: 'Patriots' },
    'NYJ': { location: 'New York', mascot: 'Jets' },
    'BAL': { location: 'Baltimore', mascot: 'Ravens' },
    'CIN': { location: 'Cincinnati', mascot: 'Bengals' },
    'CLE': { location: 'Cleveland', mascot: 'Browns' },
    'PIT': { location: 'Pittsburgh', mascot: 'Steelers' },
    'HOU': { location: 'Houston', mascot: 'Texans' },
    'IND': { location: 'Indianapolis', mascot: 'Colts' },
    'JAX': { location: 'Jacksonville', mascot: 'Jaguars' },
    'TEN': { location: 'Tennessee', mascot: 'Titans' },
    'DEN': { location: 'Denver', mascot: 'Broncos' },
    'KC': { location: 'Kansas City', mascot: 'Chiefs' },
    'OAK': { location: 'Oakland', mascot: 'Raiders' },
    'SD': { location: 'San Diego', mascot: 'Chargers' },
    'DAL': { location: 'Dallas', mascot: 'Cowboys' },
    'NYG': { location: 'New York', mascot: 'Giants' },
    'PHI': { location: 'Philadelphia', mascot: 'Eagles' },
    'WSH': { location: 'Washington', mascot: 'Redskins' },
    'CHI': { location: 'Chicago', mascot: 'Bears' },
    'DET': { location: 'Detroit', mascot: 'Lions' },
    'GB': { location: 'Green Bay', mascot: 'Packers' },
    'MIN': { location: 'Minnesota', mascot: 'Vikings' },
    'ATL': { location: 'Atlanta', mascot: 'Falcons' },
    'CAR': { location: 'Carolina', mascot: 'Panthers' },
    'NO': { location: 'New Orleans', mascot: 'Saints' },
    'TB': { location: 'Tampa Bay', mascot: 'Buccaneers' },
    'ARI': { location: 'Arizona', mascot: 'Cardinals' },
    'LA': { location: 'Los Angeles', mascot: 'Rams' },
    'SF': { location: 'San Francisco', mascot: '49ers' },
    'SEA': { location: 'Seattle', mascot: 'Seahawks' },
};

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {});

exports.next5 = function (teamName) {
    return new Promise(function (resolve, reject) {
        let teamAbbreviation = '';
        // Find the appropriate team first.
        // If they have <=3 letters in their name, then it's probably an abbreviation
        if (teamName.length <= 3) {
            // Check that it's an actual abbreviation and we're good
            if (teamname in nflTeams) {
                teamAbbreviation = teamName;
            } else {
                reject('Please enter a valid team.');
            }
        } else {
            // Otherwise, it's likely a mascot, and filter the array on that
            let filtered = Object.filter(nflTeams, nflTeam => nflTeam.mascot == teamName);
            let filteredArray = Object.keys(filtered);
            if (filteredArray.length == 1) {
                teamAbbreviation = filteredArray[0];
            } else {
                reject('Please enter a valid team.');
            }
        }
        // Now that we have a valid team, let's go grab stuff from ESPN.
        let url = 'http://www.espn.com/nfl/team/schedule/_/name/' + teamAbbreviation;
    });
};