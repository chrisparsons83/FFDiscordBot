const fuzzy = require('fuzzy-string-matching');
const roster = require('../stats/players.json');
const eightBallAnswers = [
  'Nope.', 'Definitely.', 'Hmmm...good question ;)', '...LMAO', '...You\'re joking, right?', 'Holy CRAP yes!', 'Meh, why not?',
  'Only on Tuesdays.', 'AFFIRMATIVE.', 'Not in a million years.', 'Ya never know...', 'What do I look like, a fortune teller?',
  'What do I look like, a SMART bot?!', 'You bet!', 'I don\'t know, consult the oracle.',
  'BAHAHAHAHAHA IN YOUR DREAMS', 'Hmmm...yes yes, I could see it to be tru-- wait nope nevermind.', 'Do you WANT me to smack you??',
  'As I see it, yes.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.',
  'Don\'t count on it.', 'It is decidely so.', 'Most likely.', 'My reply is no.', 'Outlook is good.', 'Reply hazy. Try again.',
  'Signs are telling me yes.', 'Very doubtful.', 'Without a doubt.', 'Yes. Definitely.', 'Answer unclear, ask later.',
  'I got the flu.', 'I\'ve been abducted by aliens.', 'I got amnesia.', 'It\'s not my job.', 'No hablo ingles.',
  'My dog ate the answer.', 'Dumb question. Ask another.', 'I don\'t care.', 'Not a chance.', 'Well maybe.',
  'What do you think?', 'Obviously.', 'You wish.', 'In your dreams.', 'The odds aren\'t good.', 'The odds are good.',
  'The stars says no.', 'Yes.', 'No.', 'Perhaps.', 'Perhaps not.', 'Most assuredly.', 'Negative.', 'Unquestionably.',
  'Not by any means.', 'Certainly.', 'Never.',
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

utilities.eightBall = () => Promise
  .resolve(`${eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)]} ${[' \:clap: \:clap: \:clap:', ''][Math.round(Math.random())]}`);

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

utilities.returnDepthChartStrings = (teamname, positionName, playerList) => {
  let string = `${positionName.toUpperCase()} depth chart\n\n`;
  for (let i = 0; i < playerList.length; i += 1) {
    string += `${i + 1}. ${playerList[i]}\n`;
  }
  return string;
};

utilities.rankPlayers = (object, players, position) => {
  const tiers = [];
  const ranking = [];
  object.string.forEach((item) => {
    const nameList = item.split(':')[1].slice(1, item.split(':')[1].length).toLowerCase();
    const names = nameList.split(',').map(name => name.trim());
    // special case for team names instead of players name
    if (position === 'dst') {
      const tier = [];
      names.forEach((name) => {
        tier.push(name);
      });
      tiers.push(tier);
    // regular player name query
    } else {
      const tier = [];
      names.forEach((name) => {
        // remove team symbol from name
        const arr = name.trim().split(' ');
        tier.push(`${arr[0]} ${arr[1]}`);
      });
      tiers.push(tier);
    }
  });
  // assign a score to each player based on the player's index in the array
  for (let i = 0; i < players.length; i += 1) {
    // if player exist in db
    const player = {};
    player.score = 0;
    if (utilities.findPlayer(players[i])) {
      player.name = utilities.findPlayer(players[i]).fullname;
    } else {
      // check for that annoying white space in the beginning and end of string
      const arr = players[i].split(' ').filter(String);
      player.name = arr.join(' ');
    }
    for (let j = 0; j < tiers.length; j += 1) {
      const matched = tiers[j].includes(player.name);
      if (matched) {
        break;
      }
      player.score += 10;
    }
    ranking.push(player);
  }
  // sort player by their score, the lower, the better
  ranking.sort((a, b) => a.score - b.score);

  // if first two player are in the same tier, return both player
  if (ranking[0].score === ranking[1].score) {
    const names = [];
    ranking.forEach((playerObj) => {
      if (playerObj.score === ranking[0].score) {
        const name = playerObj.name.split(' ').map(strings => strings[0].toUpperCase() + strings.slice(1, strings.length)).join(' ');
        names.push(name);
      }
    });
    if (names.length === 2) {
      return names.join(' and ');
    }
    return names.join(', ');
  }
  return ranking[0].name.split(' ').map(name => name[0].toUpperCase() + name.slice(1, name.length)).join(' ');
};

utilities.shuffle = (array) => {
  // loop
  for (let i = array.length-1; i > 0 ; i--) {
    //generate random index num
    let num = Math.floor(Math.random()*(i+1));
    // perform swap
    let temp = array[i];
    array[i] = array[num];
    array[num] = temp;
  }
};

utilities.shuffleList = list => new Promise(((resolve, reject) => {
  // added filter to make sure there are no empty strings in the array
  let array = list.split(',').map(key => key.trim()).filter(String);
  if (array.length <= 1) {
    reject('I need at least two items to shuffle!');
  } else {
    utilities.shuffle(array)
    resolve(array);
  }
}));

utilities.returnSnapcountStrings = (position, week, array) => {
  let string = `${(week !== 'ALL') ? `Week ${week}`: 'Total'} off snap percentages\n\n`;
  for (let i = 0; i < array.length; i += 1) {
    string += `${array[i]}\n`;
  }
  return string;
};


module.exports = utilities;
