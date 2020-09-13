const fuzzy = require('fuzzy-string-matching');
const roster = require('../stats/players.json');

const eightBallAnswers = [
  'Nope.',
  'Definitely.',
  'Hmmm...good question ;)',
  '...LMAO',
  "...You're joking, right?",
  'Holy CRAP yes!',
  'Meh, why not?',
  'Only on Tuesdays.',
  'AFFIRMATIVE.',
  'Not in a million years.',
  'Ya never know...',
  'What do I look like, a fortune teller?',
  'What do I look like, a SMART bot?!',
  'You bet!',
  "I don't know, consult the oracle.",
  'BAHAHAHAHAHA IN YOUR DREAMS',
  'Hmmm...yes yes, I could see it to be tru-- wait nope nevermind.',
  'Do you WANT me to smack you??',
  'As I see it, yes.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  "Don't count on it.",
  'It is decidely so.',
  'Most likely.',
  'My reply is no.',
  'Outlook is good.',
  'Reply hazy. Try again.',
  'Signs are telling me yes.',
  'Very doubtful.',
  'Without a doubt.',
  'Yes. Definitely.',
  'Answer unclear, ask later.',
  'I got the flu.',
  "I've been abducted by aliens.",
  'I got amnesia.',
  "It's not my job.",
  'No hablo ingles.',
  'My dog ate the answer.',
  'Dumb question. Ask another.',
  "I don't care.",
  'Not a chance.',
  'Well maybe.',
  'What do you think?',
  'Obviously.',
  'You wish.',
  'In your dreams.',
  "The odds aren't good.",
  'The odds are good.',
  'The stars says no.',
  'Yes.',
  'No.',
  'Perhaps.',
  'Perhaps not.',
  'Most assuredly.',
  'Negative.',
  'Unquestionably.',
  'Not by any means.',
  'Certainly.',
  'Never.',
];
const utilities = {};

utilities.chooseOne = chooseList =>
  new Promise((resolve, reject) => {
    // added filter to make sure there are no empty strings in the array
    const chooseListArray = chooseList
      .split(',')
      .map(key => key.trim())
      .filter(String);
    if (chooseListArray.length <= 1) {
      if (chooseList.indexOf(' ') !== -1) {
        reject('Please use commas to separate your choices.');
      } else {
        reject('Please give me at least two things to choose from - I like choices!');
      }
    } else {
      resolve(chooseListArray[Math.floor(Math.random() * chooseListArray.length)]);
    }
  });

utilities.convertToPickPosition = (pickNumber, numberOfTeams = 12) => {
  // This assumes standard snake.
  // Get the round of the pick (which is 1-indexed)
  const draftRound = Math.floor((pickNumber - 1) / numberOfTeams) + 1;
  // Get the number of picks at the start of the round
  const numberOfPicksSoFar = (draftRound - 1) * numberOfTeams;
  // Subtract to get how far along in the round is the pick
  const roundPick = pickNumber - numberOfPicksSoFar;
  return `${draftRound}.${roundPick}`;
};

utilities.eightBall = () =>
  Promise.resolve(
    `${eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)]} ${
      [' :clap: :clap: :clap:', ''][Math.round(Math.random())]
    }`,
  );

// return the closest matching player
utilities.findPlayer = (string) => {
  let score = 0;
  let object;
  for (let i = 0; i < roster.length; i += 1) {
    const fuzzyScore = fuzzy(string, roster[i].fullname);
    if (fuzzyScore > score && fuzzyScore > 0.65) {
      score = fuzzyScore;
      object = roster[i];
      object.score = score;
      object.position = roster[i].position;
      object.no_suffix_name = utilities.removeSuffix(roster[i].fullname);
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
    [firstName, ...lastName] = string
      .toString()
      .split(' ')
      .map(value => value.trim())
      .slice(0);
    lastName = lastName.join(' ');
  } else {
    [lastName, ...firstName] = string
      .toString()
      .split(',')
      .map(value => value.trim())
      .slice(0);
    firstName = firstName.join(' ');
  }
  return {
    firstName,
    lastName,
    first_space_last: `${firstName} ${lastName}`,
    last_comma_first: `${lastName},${firstName}`,
  };
};

utilities.returnDepthChartStrings = (positionName, playerList, lastUpdated) => {
  let string = `*${lastUpdated}*\n\n`;
  if (positionName === 'wr') {

    let rwrSorted = [], lwrSorted = [], swrSorted = []
    // sort them by position
    playerList.map(x => {
      if (x.includes('RWR')) {
        rwrSorted.push(x.slice(4));
      }
      if (x.includes('LWR')) {
        lwrSorted.push(x.slice(4));
      }
      if (x.includes('SWR')) {
        swrSorted.push(x.slice(4));
      }
    });

    if (rwrSorted.length !== 0) {
      string += `**Right Receiver:** \n`
      rwrSorted.map((x, index) => {
        string += `${index+1}. ${x}\n`
      });      
    }
    if (lwrSorted.length !== 0) {
      string += `\n**Left Receiver:** \n`
      lwrSorted.map((x, index) => {
        string += `${index+1}. ${x}\n`
      });      
    }    
    if (swrSorted.length !== 0) {
      string += `\n**Slot Receiver:** \n`
      swrSorted.map((x, index) => {
        string += `${index+1}. ${x}\n`
      });      
    }
  } else {
    for (let i = 0; i < playerList.length; i += 1) {
      string += `${i+1}. ${playerList[i]}\n`;
    }    
  }
  return string;
};

utilities.rankPlayers = (object, players, position) => {
  const tiers = [];
  const ranking = [];
  object.string.forEach((item) => {
    const nameList = item
      .split(':')[1]
      .slice(1, item.split(':')[1].length)
      .toLowerCase();
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
      player.name = utilities.findPlayer(players[i]).no_suffix_name;
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
        const name = playerObj.name
          .split(' ')
          .map(strings => strings[0].toUpperCase() + strings.slice(1, strings.length))
          .join(' ');
        names.push(name);
      }
    });
    if (names.length === 2) {
      return names.join(' and ');
    }
    return names.join(', ');
  }
  return ranking[0].name
    .split(' ')
    .map(name => name[0].toUpperCase() + name.slice(1, name.length))
    .join(' ');
};

utilities.shuffle = (array) => {
  // loop
  for (let i = array.length - 1; i > 0; i -= 1) {
    // generate random index num
    const num = Math.floor(Math.random() * (i + 1));
    // perform swap
    const temp = array[i];
    array[i] = array[num];
    array[num] = temp;
  }
};

utilities.shuffleList = list =>
  new Promise((resolve, reject) => {
    // added filter to make sure there are no empty strings in the array
    const array = list
      .split(',')
      .map(key => key.trim())
      .filter(String);
    if (array.length <= 1) {
      reject('I need at least two items to shuffle!');
    } else {
      utilities.shuffle(array);
      resolve(array);
    }
  });

utilities.returnSnapcountStrings = (position, week, array) => {
  let string = `${week !== 'ALL' ? `Week ${week}` : 'Total'} off snap percentages\n\n`;
  for (let i = 0; i < array.length; i += 1) {
    string += `${array[i]}\n`;
  }
  return string;
};

utilities.argumentSplit = (string) => {
  let array = string
    .split(/[\s,]/)
    .filter(n => /\S/.test(n));
  return array;
};

// helper function for wdis command, helps sanitizes and reduce user query errors
utilities.wdisHelper = (string) => {
  const position = ['qb', 'rb', 'te', 'wr', 'k', 'dst', 'flex'];
  const scoring = ['standard','half','full'];
  let userPosition;
  let userScoring;
  let array = utilities.argumentSplit(string);
  let final = [];
  // check if correct position was given
  array.map(x => {
    position.map(y => {
      if (x === y) {
        userPosition = x
      }
    });
  });

  // check to see if scoring format was included
  array.map(x => {
    scoring.map(y => {
      if (x === y) {
        userScoring = x
      }
    })
  });
  
  // since we dont know what the user meant with names
  // we concat 2 strings to be used for fuzzy matching
  let combination = [];
  for (let i = 0; i < array.length; i++) {
    if (i < array.length-1){
      combination.push(`${array[i]} ${array[i+1]}`);
    }
  }

  // we go through each combination and see if we find either last names or full name with score over .68
  // last names/ full name combination seem to have the best hit rate for fuzzy in matching names
  combination.map(x => {
    let bestScore = 0;
    let bestMatch;
    roster.map(y => {
      let scoreFull = fuzzy(y.fullname, x);
      let scoreLast = fuzzy(y.last, x);
      if (scoreFull > bestScore && scoreFull > 0.68 && position.includes(y.position)) {
        bestScore = scoreFull
        bestMatch = y.fullname
        
      }
      if (scoreLast > bestScore && scoreLast > 0.68 && position.includes(y.position)) {
        bestScore = scoreLast;
        bestMatch = y.fullname;
      }
    });
    if (bestMatch) {
      final.push(bestMatch)
    }
  });
  
  // remove dupe names
  final = [...new Set(final)];

  // defaults to standard if no scoring was given
  if (!userScoring) {
    final.unshift('standard');
  } else {
    final.unshift(userScoring);
  }
  // if no position, it will convert itself to either flex if there was different position enter
  // or enter the correct position if everyone plays the same position
  if (!userPosition) {
    let majority = [];
    for (let i = 1; i < final.length; i++) {
      let position = utilities.findPlayer(final[i]).position;
      majority.push(position);
    }
    //check if every player position is the same
    // if all the position are the same, position is the players position
    // if mixed, then it should be flex
    if (majority.every(x => x === majority[0])) {
      final.unshift(majority[0]) 
    } else {
      final.unshift('flex');
    }
  } else {
    //find position that was entered correctly
    final.unshift(userPosition);
  }
  // returns the original input for error catching if final array lenght is < 3 
  if (final.length < 3) {
    return array
  }
  return final
};

utilities.depthChartSplit = (string) => {
  //return if empty string
  if (!string) return '';
  let array = string.split(/[,]/)
  // get last after split by comma
  let lastName = array[0];
  // get firstname after split, filtering the whitespace and return the first element of array
  let firstName = array[1].split(' ').filter(Boolean).shift();
  return `${firstName} ${lastName}`;
};

utilities.capitalizeFirstLetterOfName = (string) => {
  // only does the operation if string exist
  if (string) {
    let splitted = string.toLowerCase().split(' ');
    let romanNumerals = ['i','ii','iii','iv','v','vi','vii','viii','ix','x']
    let name = '';
    //change roman numerals back to upper case if its part of the name
    if (romanNumerals.includes(splitted[splitted.length-1])) {
      let last = splitted[splitted.length-1].toUpperCase();
      splitted.pop();
      splitted.push(last);
    }

    splitted.map(x => {
      name += `${x.charAt(0).toUpperCase() + x.slice(1)} `;
    });      
  
    return name 
  }
}

utilities.checkMinorTypo = (string, obj) => {
  if (!/^[a-zA-Z]+$/.test(string)) {
    return false;
  }
  let score = 0;
  let response = '';
  for (let key in obj) {
    const fuzzyScore = fuzzy(string, key);
    if (fuzzyScore > score) {
      score = fuzzyScore;
      response = obj[key];
    }
  }
  return response;  
}

utilities.removeSuffix = (string) => {
  const suffix = ['jr.', 'sr.', 'i', 'ii', 'iii', 'iv', 'v'];
  const splitted = string.split(' ');
  if (suffix.includes(splitted[splitted.length-1])) {
    return(`${splitted[0]} ${splitted[1]}`);
  } 
  return string
}

module.exports = utilities;

