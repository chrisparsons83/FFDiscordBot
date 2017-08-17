const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
moment().format();

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
    { abbreviation: 'LAC', location: 'Los Angeles', mascot: 'Chargers' },
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
    { abbreviation: 'LAR', location: 'Los Angeles', mascot: 'Rams' },
    { abbreviation: 'SF', location: 'San Francisco', mascot: '49ers' },
    { abbreviation: 'SEA', location: 'Seattle', mascot: 'Seahawks' },
];

exports.next5 = function (teamNameLookup) {
    return new Promise(function (resolve, reject) {
        let nextFiveGames = {};
        let teamName = {};
        nextFiveGames.schedule = [];

        teamName = lookupTeamName(teamNameLookup);
        if (teamName === undefined) {
            return reject("No team name was found.");
        }
        fullSchedule(teamName).then((schedule) => {
            // If schedule is empty, reject.
            if (schedule.length === 0) {
                return reject("There are no upcoming games this season for the " + teamName.location + " " + teamName.mascot);
            }
            let today = moment();
            let futureGames = schedule.filter(function (game) {
                let gameDate = moment(game.gameDate);
                return gameDate.diff(today) > 0;
            });
            // Determine how many games are left, if less than five, then set
            // that as the max
            let number_to_show = 5;
            if (schedule.length < 5) {
                number_to_show = schedule.length;
            }
            for (let i = 0; i < number_to_show; i++) {
                let at = '';
                if (futureGames[i].location == 'Away') {
                    at = '@';
                }
                nextFiveGames.schedule[i] = at + futureGames[i].opponent;
            }
            nextFiveGames.message = nextFiveGames.schedule.join(", ")
            return resolve(nextFiveGames);
        });
    });
}

function lookupTeamName(value) {
    // Filter on the value on any of the three keys, and return the first result
    // since it should be impossible to overlap.
    lookup = value.toUpperCase();
    let teamArray = nflTeams.filter((item) => {
        return (lookup === item.abbreviation.toUpperCase()) || (lookup === item.location.toUpperCase()) || (lookup === item.mascot.toUpperCase())
    })[0];
    return teamArray;
}

function fullSchedule(team) {
    return new Promise(function (resolve, reject) {

        // Now that we have a valid team, let's go grab stuff from ESPN.
        let url = 'http://www.espn.com/nfl/team/schedule/_/name/' + team.abbreviation;
        request(url, function (error, response, html) {
            if (error) { reject(error); }

            let $ = cheerio.load(html);

            // We go through the statheads, when we get to one that has regular
            // season schedule, we know we're in the right place.
            let colheads = 0;
            let regularSeason = false;
            let schedule = [];

            // We can use this to get the current year too - tricky!
            let first = moment().month('November').startOf('month');
            let daylightSavingsDate = first.day() % 6 === 0 ? first.add(1, 'day').day(1) : first;

            $('.mod-content TR').each(function () {
                let data = $(this);

                // If we have a colhead row, then we don't care about the data. Move on.
                if (data.hasClass('colhead') && regularSeason === true) {
                    colheads++;
                    return true;
                }
                else if (data.hasClass('stathead')) {
                    if (data.text().indexOf('Regular Season') !== -1) {
                        regularSeason = true;
                    }
                    else {
                        regularSeason = false;
                    }
                    return true;
                }
                else if (regularSeason === true && (data.hasClass('oddrow') || data.hasClass('evenrow'))) {
                    // Hey look, data we care about! Let's parse it.
                    let gameDetails = {};
                    let gametime = '';

                    // Get the week number, for whatever reason.
                    gameDetails.weekNumber = $('TD:nth-child(1)', this).text();

                    // If there's a bye week, we're pretty much done. Otherwise, let's do stuff.
                    let gameDateString = $('TD:nth-child(2)', this).text();
                    if (gameDateString == 'BYE WEEK') {
                        gameDetails.opponent = 'BYE';
                    }
                    else {
                        // This feels dirty, but it should be futureproof for setting the year.
                        if (gameDateString.indexOf('Jan') >= 0) {
                            gameYear = daylightSavingsDate.year() + 1;
                        }
                        else {
                            gameYear = daylightSavingsDate.year();
                        }
                        // We can figure out the time too, if the game hasn't been completed.
                        // Why doesn't anyone care about game time after the game is finished? So weird.
                        if (colheads === 1) {
                            let gameTimeString = $('TD:nth-child(4)', this).text()
                            gameTime = gameTimeString.substr(0, gameTimeString.indexOf('M') + 1);
                        }
                        else {
                            gameTime = '02:00:00';
                        }

                        // Add the correct timezone, since ESPN only does ET, the jerks.
                        gameTime = gameTime + ' EST';

                        // Now that we've got the date and possibly the time, we can make it an actual date.
                        let gameDateTimeString = gameDateString + ', ' + gameYear + ' ' + gameTime;
                        let gameDate = moment(gameDateTimeString, 'ddd, MMM D, YYYY h:m a');
                        gameDetails.gameDate = gameDate.format();

                        // Now that we've finally got all that stupid stuff for the date, let's get the team and location.
                        if ($('TD:nth-child(3) .game-schedule .game-status', this).text() == 'vs') {
                            gameDetails.location = 'Home';
                        } else {
                            gameDetails.location = 'Away';
                        }
                        opponentURLPath = $('TD:nth-child(3) .game-schedule .team-name A', this).attr('href').substr(36).split("/");
                        gameDetails.opponent = opponentURLPath[0].toUpperCase();
                    }
                    schedule.push(gameDetails);
                }
            });
            resolve(schedule);
        });
    });
};