const teams = require('../stats/teamLookup.json');
const fuzzy = require('fuzzy-string-matching');

const roster = require('../stats/players.json');

const eightBallAnswers = [
  'Nope.', 'Definitely.', 'Hmmm...good question ;)', '...LMAO', '...You\'re joking, right?', 'Holy CRAP yes', 'Meh, why not?',
  'Only on Tuesdays.', 'AFFIRMATIVE.', 'Not in a million years.', 'Ya never know...', 'What do I look like, a fortune teller?',
  'What do I look like, a SMART bot?!', 'You bet!', 'I don\'t know, consult the oracle.',
  'BAHAHAHAHAHA IN YOUR DREAMS', 'Hmmm...yes yes, I could see it to be tru-- wait nope nevermind.', 'Do you WANT me to smack you??',
  'As I see it, yes.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.',
  'Don\'t count on it.', 'It is decidely so.', 'Most likely.', 'My reply is no.', 'Outlook is good.', 'Reply hazy. Try again.',
  'Signs are telling me yes.', 'Very doubtful.', 'Without a doubt.', 'Yes. Definitely.', 'Answer unclear, ask later.',
  'I got the flu.', 'I\'ve been abducted by aliens.', 'I got amnesia.', 'It\'s not my job.', 'No hablo ingles.',
  'My dog ate the answer.', 'Dumb question. Ask another.', 'I don\'t care.', 'Not a chance.', 'Well maybe.',
  'What do you think?', 'Obviously.', 'You wish.', 'In your dreams.', 'The odds aren\'t good.', 'The odds are good.',
  'The stars says no.',
];

const utilities = {};

utilities.chooseOne = chooseList => new Promise(((resolve, reject) => {
  // added filter to make sure there are no empty strings in the array
  const chooseListArray = chooseList.split(',').map(key => key.trim()).filter(String);
  if (chooseListArray.length <= 1) {
    if (chooseList.indexOf(' ') !== -1) {
      reject('Please use commas to separate your choices.');
    } else {
      reject('Please give me at least two things to choose from - I like choices!');
    }
  } else {
    resolve(chooseListArray[Math.floor(Math.random() * chooseListArray.length)]);
  }
}));

utilities.eightBall = () => new Promise(((resolve) => {
  resolve(eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)]);
}));

// team abbreviations lookup
utilities.symbolsLookup = () => {
  let string = '';
  const keys = Object.keys(teams);
  keys.sort();
  keys.forEach((symbol) => {
    string += `**${symbol}** : ${teams[symbol].name}\n`;
  });
  return string;
};

// return the closest matching player
utilities.findPlayer = (string) => {
  let score = 0;
  let object;
  for (let i = 0; i < roster.length; i += 1) {
    const fuzzyScore = fuzzy(string, roster[i].fullname);
    if (fuzzyScore > score && fuzzyScore > 0.6) {
      score = fuzzyScore;
      object = roster[i];
      object.score = score;
      object.position = roster[i].position;
    }
  }
  return object;
};

// this returns an object with two versions of the name
// passed to it, so
utilities.standardizePlayerName = (string) => {
  let firstName = '';
  let lastName = '';

  if (string.indexOf(',') === -1) {
    [firstName, ...lastName] = string.toString().split(' ').map(value => value.trim()).slice(0);
    lastName = lastName.join(' ');
  } else {
    [lastName, ...firstName] = string.toString().split(',').map(value => value.trim()).slice(0);
    firstName = firstName.join(' ');
  }
  return {
    firstName,
    lastName,
    first_space_last: `${firstName} ${lastName}`,
    last_comma_first: `${lastName},${firstName}`,
  };
};

utilities.returnDepthChartStrings = (teamname, positionName, players) => {
  let string = `${positionName.toUpperCase()} depth chart\n\n`;
  for (let i = 0; i < players.length; i += 1) {
    string += `**${i + 1}**. ${players[i]}\n`;
  }
  return string;
};

utilities.returnBorisTiers = (arr) => {
  let msg = '';
  arr.forEach((item) => {
    const tierNumber = item.split(':')[0];
    const nameList = item.split(':')[1].slice(1, item.split(':')[1].length);
    msg += `\n**Tier ${tierNumber}**\n${nameList}`;
  });
  return msg;
};

utilities.rankPlayers = (object, players, position) => {
  const tiers = [];
  const ranking = [];
  let unrankScore = 1000;
  object.string.forEach((item) => {
    const nameList = item.split(':')[1].slice(1, item.split(':')[1].length).toLowerCase();
    const names = nameList.split(',').map(name => name.trim());
    // special case for team names instead of players name
    if (position === 'dst') {
      names.forEach((name) => {
        tiers.push(name);
      });
    // regular player name query
    } else {
      names.forEach((name) => {
        // remove team symbol from name
        const arr = name.trim().split(' ');
        tiers.push(`${arr[0]} ${arr[1]}`);
      });
    }
  });
  // assign a score to each player based on the player's index in the array
  for (let i = 0; i < players.length; i += 1) {
    const player = {};
    // if player exist in db
    if (utilities.findPlayer(players[i])) {
      player.name = utilities.findPlayer(players[i]).fullname;
    } else {
      // check for that annoying white space in the beginning and end of string
      const arr = players[i].split(' ').filter(String);
      player.name = arr.join(' ');
    }
    if (tiers.includes(player.name)) {
      player.score = tiers.indexOf(player.name);
    } else {
      player.score = unrankScore;
      unrankScore += 1;
    }
    ranking.push(player);
  }
  // sort player by their score, the lower, the better
  ranking.sort((a, b) => {
    return a.score - b.score;
  });
  console.log(ranking[0].name.split(' ').map(name => name[0].toUpperCase() + name.slice(1, name.length)).join(' '));
  return ranking[0].name.split(' ').map(name => name[0].toUpperCase() + name.slice(1, name.length)).join(' ');
};

module.exports = utilities;
