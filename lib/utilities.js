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

utilities.list_order = ['pts_std', 'pts_ppr', 'pts_half_ppr', 'td',
                        'rush_td', 'rush_yd', 'rush_att', 'rush_ypa',
                        'rec_td', 'rec_yd', 'rec', 'rec_ypr', 'rec_pct', 'rec_tgt', 'rec_ypt', 'pass_yd',
                        'bonus_rush_rec_yd_100', 'bonus_rush_yd_100', 'bonus_rush_att_20', 'fum_lost', 'fum', 'gs', 'gp', 'gms_active'];

utilities.notinclude = ['humidity', 'wind_speed', 'temperature', 'tm_st_snp', 'bonus_rec_rb', 'bonus_rec_wr', 'rush_fd', 'rush_lng',
                        'rec_lng', 'rec_fd', 'pass_fd', 'pass_lng', 'off_snp', 'cmp_pct', 'tm_off_snp', 'bonus_pass_cmp_25',
                        'pass_rtg', 'pass_sack_yds', 'tm_def_snp', 'pass_int_td', 'st_snp', 'pr_lng', 'bonus_pass_yd_300', 'pass_cmp_40p',
                        'def_snp', 'gs', 'gms_active', 'gp', 'bonus_rec_yd_100', 'rec_40p', 'bonus_rush_rec_yd_200'];

utilities.notinclude_stats = ['humidity', 'wind_speed', 'temperature', 'tm_st_snp', 'bonus_rec_rb', 'rush_fd', 'rush_lng',
                        'rec_lng', 'rec_fd', 'pass_fd', 'pass_lng', 'off_snp', 'cmp_pct', 'tm_off_snp', 'bonus_pass_cmp_25',
                        'pass_rtg', 'pass_sack_yds', 'tm_def_snp', 'pass_int_td', 'st_snp', 'pr_lng', 'bonus_pass_yd_300', 'pass_cmp_40p',
                        'def_snp', 'gs', 'gms_active', 'bonus_rush_rec_yd_100', 'bonus_rush_yd_100', 'bonus_rush_att_20', 'rec_pct', 'bonus_rec_yd_100',
                        'bonus_rush_att_20', 'rush_40p', 'bonus_rush_yd_200', 'rec_40p', 'rec_td_40p', 'bonus_rec_yd_100', 'bonus_rush_rec_yd_200'];

utilities.notinclude_projections = ['humidity', 'wind_speed', 'temperature', 'rec_td', 'rec', 'rec_0_4', 'rec_5_9', 'rec_40p', 'rec_30_39', 'rec_20_29',
                        'rec_10_19', 'bonus_rec_rb', 'bonus_rec_wr', 'sack_yd', 'int_ret_yd', 'idp_tkl_solo', 'idp_tkl_loss', 'idp_tkl_ast',
                        'idp_tkl', 'idp_safe', 'idp_sack', 'idp_qb_hit', 'idp_pass_def', 'idp_int', 'idp_fum_rec', 'idp_ff', 'fum_ret_yd',
                         'tm_st_snp', 'bonus_rec_rb', 'rush_fd', 'rush_lng', 'fum_lost', 'fum', 'rec_tgt',
                        'rec_lng', 'rec_fd', 'pass_fd', 'pass_lng', 'off_snp', 'cmp_pct', 'tm_off_snp', 'bonus_pass_cmp_25', 'bonus_rush_rec_yd_100',
                        'pass_rtg', 'pass_sack_yds', 'tm_def_snp', 'pass_int_td', 'st_snp', 'pr_lng', 'bonus_pass_yd_300', 'pass_cmp_40p',
                        'def_snp', 'rush_ypa', 'rush_yd', 'rush_att', 'rec_ypt', 'rec_ypr', 'rec_yd', 'rec_pct', 'gs', 'gp', 'gms_active', 'rush_td', 'pass_yd',
                        'pass_ypa', 'pass_ypc', 'td', 'pass_int', 'pass_inc', 'pass_cmp', 'pass_att'];

utilities.convert_stats = {
  'rush_ypa': 'Rushing yd/attempt',
  'rush_td': 'Rushing TDs',
  'rush_att': 'Rushing attempts',
  'pts_std': 'Fantasy Pts (STD Format)',
  'pts_ppr': 'Fantasy Pts (Full PPR)',
  'pts_half_ppr': 'Fantasy Points (.5ppr)',
  'pass_ypc': 'Passing YPR',
  'pass_ypa': 'Passing YPA',
  'pass_yd': 'Passing Yards',
  'pass_td_40p': '40+yd TD pass',
  'pass_td': 'Touchdowns',
  'pass_int': 'Interceptions',
  'pass_cmp_40p': 'Passes Completed 40+yds',
  'pass_cmp': 'Passes Completed',
  'pass_att': 'Passes Attempts',
  'gs': 'Games Started',
  'gp': 'Games Played',
  'gms_active': 'Games Active',
  'fum_lost': 'Fumbles Lost',
  'fum': 'Fumbles',
  'cmp_pst': 'Completion Percentage',
  'rec_yd': 'Reception Yards',
  'off_snp': 'Offensive Snaps',
  'bonus_rush_yd_100': '100+ Rushing yds Games',
  'bonus_rush_rec_yd_200': '200+ Rushing yds Games',
  'bonus_rush_rec_yd_100': '100+ Reception yds Games',
  'tm_off_snp': 'Team\'s Total Offensive Snaps',
  'rec_ypt': 'Reception yds/target',
  'bonus_rec_rb': 'RB receptions',
  'rec_ypr': 'Yards/Reception',
  'idp_tkl': 'Tackles',
  'tm_def_snp': 'Team\'s Total Defensive Snaps',
  'rush_fd': 'Rushes for 1st downs',
  'bonus_rush_yd_200': '200+ Receiving Yards',
  'rec_2pt': '2pt Conversion Receptions',
  'rec': 'Receptions',
  'bonus_rush_att_20': '20+ yard Rushes',
  'idp_tkl_solo': 'Solo Tackles',
  'td': 'Touchdowns',
  'rush_2pt': '2pt Conversion Rushes',
  'rec_td': 'Receiving TDs',
  'rush_lng': 'Longest Rush Attempt',
  'rec_lng': 'Longest Reception',
  'rec_tgt': 'Reception Targets',
  'rush_yd': 'Rushing Yards',
  'rec_40p': '40+ yds Receptions',
  'rush_40p': '40+ yds Rushes',
  'rec_fd': '1st Down Receptions',
  'rec_pct': 'Catch Percentage',
  'sack_yd': 'Sack Yards',
  'int_red_yd': 'Interception Return Yards',
  'idp_tkl_solo': 'Solo Tackles',
  'idp_tkl_loss': 'Tackles for a Loss',
  'idp_tkl_ast': 'Tackles (Assist)',
  'idp_tkl': 'Total Tackles',
  'idp_pass_def': 'Passes Deflected',
  'idp_sack': 'Sacks',
  'idp_qb_hit': 'QB Hits',
  'idp_int': 'Interceptions',
  'idp_fum_rec': 'Fumble Recoveries',
  'idp_ff': 'Fumbles Forced',
  'fum_ret_yd': 'Fumble Return Yds',
  'def_snp': 'Defensive Snaps',
  'pass_sack': 'QB Sacked',
  'pass_inc': 'Incomplete Passes',
  'pr_ypa': 'PR Yds/Attempt',
  'pr_yd': 'PR Yards',
  'pr': 'Punt Returns',
  'idp_tkl_solo': 'Solo Tackles',
  'idp_tkl_loss': 'Tackles for a Loss',
  'idp_tkl_ast': 'Tackles (Assist)',
  'idp_tkl': 'Total Tackle',
  'ssack_yd': 'Sack Yards',
  'idp_sack': 'Sacks',
  'idp_qb_hit': 'QB Hits',
  'idp_int': 'Interceptions',
  'idp_fum_rec': 'Fumble Recoveries',
  'idp_ff': 'Fumbles Forced',
  'fum_ret_yd': 'Fumble Return Yds',
  'idp_safe':'Forced Safety',
  'rec_5_9': 'Reception (5-9 yds)',
  'rec_0_4': 'Receptions (0-4 yds)',
  'rec_10_19': 'Receptions (10-19 yds)',
  'rec_20-29': 'Receptions (20-29 yds)',
  'rec_30_39': 'Receptions (30-39 yds)',
  'bonus_rec_wr': 'WR Receptions Bonus',
  'pass_2pt': '2pt Conversion Passes',
  'bonus_rec_yd_100': '100+ yds Receiving Games',
  'bonus_pass_yd_400': '400+ yds Passing Games',
  'int_ret_yd': 'Interception Return Yards',
  'kr_yd': 'Kick Return Yards',
  'kr_ypa': 'Kick Return YPA',
  'kr': 'Kick Returns',
  'kr_lng': 'Longest Kick Return'
}

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

module.exports = utilities;
