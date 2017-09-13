const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const nflteams = require('./nflteams');

const fullSchedule = team => new Promise(((resolve, reject) => {
  // Now that we have a valid team, let's go grab stuff from ESPN.
  const url = `http://www.espn.com/nfl/team/schedule/_/name/${team}`;
  request(url, (error, response, html) => {
    if (error) { reject(error); }

    const $ = cheerio.load(html);

    // We go through the statheads, when we get to one that has regular
    // season schedule, we know we're in the right place.

    // temp fix for starting colhead number. I believe espn move the colhead each week
    let colheads = parseInt($('.colhead').next().text()[0], 10);
    let regularSeason = false;
    const schedule = [];

    // We can use this to get the current year too - tricky!
    const first = moment().month('November').startOf('month');
    const daylightSavingsDate = first.day() % 6 === 0 ? first.add(1, 'day').day(1) : first;

    $('.mod-content TR').each(function game() {
      const data = $(this);
      // If we have a colhead row, then we don't care about the data. Move on.
      if (data.hasClass('colhead') && regularSeason === true) {
        colheads += 1;
        return true;
      } else if (data.hasClass('stathead')) {
        if (data.text().indexOf('Regular Season') !== -1) {
          regularSeason = true;
        } else {
          regularSeason = false;
        }
        return true;
      } else if (regularSeason === true && (data.hasClass('oddrow') || data.hasClass('evenrow'))) {
        // Hey look, data we care about! Let's parse it.
        const gameDetails = {
          gameDate: '',
          gameDay: '',
          gameTime: '',
          location: '',
        };

        // Get the week number, for whatever reason.
        gameDetails.weekNumber = $('TD:nth-child(1)', this).text();

        // If there's a bye week, we're pretty much done. Otherwise, let's do stuff.
        const gameDateString = $('TD:nth-child(2)', this).text();

        if (gameDateString === 'BYE WEEK') {
          gameDetails.opponent = {
            abbreviation: 'BYE',
            espn_abbreviation: 'BYE',
            location: 'BYE',
            mascot: 'BYE',
            name: 'BYE',
            logo: '',
          };
        } else {
          // This feels dirty, but it should be futureproof for setting the year.
          let gameYear = '';
          if (gameDateString.indexOf('Jan') >= 0) {
            gameYear = daylightSavingsDate.year() + 1;
          } else {
            gameYear = daylightSavingsDate.year();
          }
          // We can figure out the time too, if the game hasn't been completed.
          // Why doesn't anyone care about game time after the game is finished?

          // temp fix for colheads
          const gameTimeString = $('TD:nth-child(4)', this).text();
          const gameTime = `${gameTimeString.substr(0, gameTimeString.indexOf('M') + 1)} EST`;

          /* disabled old code for now until we have a better fix option
          let gameTime = '';
          if (colheads === 1) {
            const gameTimeString = $('TD:nth-child(4)', this).text();
            gameTime = gameTimeString.substr(0, gameTimeString.indexOf('M') + 1);
          } else {
            gameTime = '02:00:00';
          }
          // Add the correct timezone, since ESPN only does ET, the jerks.
          // gameTime += ' EST';
          */

          // Now that we've got the date and possibly the time, we can make it an
          // actual date.
          const gameDateTimeString = `${gameDateString}, ${gameYear} ${gameTime}`;
          const gameDate = moment(gameDateTimeString, 'ddd, MMM D, YYYY h:m a');
          gameDetails.gameDate = gameDate.format();
          gameDetails.gameDay = gameDate.format('dddd');
          gameDetails.gameTime = gameDate.format('h:mmA');

          // catch special time case like to be determined or postponed games
          if (!gameTimeString.substr(0, gameTimeString.indexOf('M') + 1)) {
            gameDetails.gameDate = gameDate.format();
            gameDetails.gameDay = gameDate.format('dddd');
            gameDetails.gameTime = gameTimeString.split(' ')[0];
          } else {
            gameDetails.gameDate = gameDate.format();
            gameDetails.gameDay = gameDate.format('dddd');
            gameDetails.gameTime = gameDate.format('h:mmA');
          }

          // Now that we've finally got all that stupid stuff for the date, let's
          // get the team and location.
          if ($('TD:nth-child(3) .game-schedule .game-status', this).text() === 'vs') {
            gameDetails.location = '';
          } else {
            gameDetails.location = '@';
          }
          const opponentURLPath = $('TD:nth-child(3) .game-schedule .team-name A', this).attr('href').substr(36).split('/');
          gameDetails.opponent = nflteams.getTeam(opponentURLPath[0], (err, teamObject) => {
            if (err) return reject(err);
            return teamObject;
          });
        }
        schedule.push(gameDetails);
      }
      return true;
    });

    // Because bye week storage on ESPN is D-U-M-B, we need to add the date
    // in after the schedule is populated to figure out what on earth the date
    // should be. We're looking for the Sunday before the next week's game.
    // First, find the index of the bye week. We can safely assume each team only
    // gets one bye week.

    // temp fix for mia and tb postponed games
    let byeWeekIndex;
    if (team === 'MIA' || team === 'TB') {
      byeWeekIndex = schedule.indexOf(schedule.filter(game => game.opponent.abbreviation === 'POSTPONED')[0]);
    } else {
      byeWeekIndex = schedule.indexOf(schedule.filter(game => game.opponent.abbreviation === 'BYE')[0]);
    }

    // old const variable, disabled for now
    // const byeWeekIndex = schedule.indexOf(schedule.filter(game => game.opponent.abbreviation === 'BYE')[0]);

    // Then, get the date of the game after the bye week is over
    // Go back 2 days, so if we have a Monday night game after the bye, we get to the previous week
    // Then find the sunday before that to find when the bye would be, assuming it's on Sunday.
    if (team !== 'MIA' && team !== 'TB') {
      schedule[byeWeekIndex].gameDate = moment(schedule[byeWeekIndex + 1].gameDate)
        .subtract(2, 'days')
        .startOf('week')
        .add(18, 'hours');
    }
    // We do this because if you had a MNF game, then you'd just get the day before.
    resolve(schedule);
  });
}));

exports.next5 = teamNameLookup => new Promise(((resolve, reject) => {
  let nextFiveGames = {};

  // Get the full schedule and then strip down the rest
  this.remainingGames(teamNameLookup).then((remainingGames) => {
    nextFiveGames = remainingGames;
    const scheduleLength = (nextFiveGames.schedule.length < 5) ? nextFiveGames.schedule.length : 5;
    nextFiveGames.schedule = nextFiveGames.schedule.slice(0, scheduleLength);
    resolve(remainingGames);
  }).catch(err => reject(err));
  return true;
}));

exports.remainingGames = teamNameLookup => new Promise(((resolve, reject) => {
  const remainingGames = {};

  remainingGames.team = nflteams.getTeam(teamNameLookup, (err, teamObject) => {
    if (err) return reject(err);
    return teamObject;
  });

  fullSchedule(remainingGames.team.espn_abbreviation).then((schedule) => {
    // If schedule is empty, reject.
    if (schedule.length === 0) {
      return reject(`There are no upcoming games this season for the ${remainingGames.team.location} ${remainingGames.team.mascot}`);
    }
    const today = moment();
    const futureGames = schedule.filter((game) => {
      const gameDate = moment(game.gameDate);
      return gameDate.diff(today) > 0;
    });

    remainingGames.schedule = futureGames;

    return resolve(remainingGames);
  });
  return true;
}));
