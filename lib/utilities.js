const teams = require(__dirname + '/../stats/teamLookup.json');
const fuzzy = require('fuzzy-string-matching');
const roster = require(__dirname + '/../stats/players.json');

const eightBallAnswers = [
    'Nope.', 'Definitely.', 'Hmmm...good question ;)', '...LMAO', '...You\'re joking, right?', 'Holy CRAP yes','Meh, why not?',
    'Only on Tuesdays.', 'AFFIRMATIVE.','Not in a million years.','Ya never know...','What do I look like, a fortune teller?',
    'What do I look like, a SMART bot?!','You bet!','I don\'t know, consult the oracle.',
    'BAHAHAHAHAHA IN YOUR DREAMS','Hmmm...yes yes, I could see it to be tru-- wait nope nevermind.','Do you WANT me to smack you??',
    'As I see it, yes.','Ask again later.','Better not tell you now.','Cannot predict now.','Concentrate and ask again.',
    'Don\'t count on it.','It is decidely so.','Most likely.','My reply is no.','Outlook is good.','Reply hazy. Try again.',
    'Signs are telling me yes.','Very doubtful.', 'Without a doubt.','Yes. Definitely.','Answer unclear, ask later.',
    'I got the flu.','I\'ve been abducted by aliens.','I got amnesia.', 'It\'s not my job.','No hablo ingles.',
    'My dog ate the answer.', 'Dumb question. Ask another.', 'I don\'t care.', 'Not a chance.', 'Well maybe.',
    'What do you think?', 'Obviously.', 'You wish.', 'In your dreams.', 'The odds aren\'t good.', 'The odds are good.',
    'The stars says no.',
];

let utilities = {};

utilities.chooseOne = (chooseList) => {
    return new Promise(function (resolve, reject) {
        let chooseListArray = chooseList.split(",").map((key) => key.trim());
        if (chooseListArray.length <= 1) {
            resolve("Please use commas to separate your choices.");
        } else {
            resolve(chooseListArray[Math.floor(Math.random() * chooseListArray.length)]);            
        }
    });
};

utilities.eightBall = () => {
    return new Promise(function (resolve, reject) {
        resolve(eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)]);
    });
};

//team abbreviations lookup
utilities.symbolsLookup = function() {
  let string = '';
  let keys = Object.keys(teams);
  keys.sort();
  keys.forEach(symbol => {
    string += `**${symbol}** : ${teams[symbol].name}\n`;
  })
  return string;
}

// return the closest matching player
utilities.findPlayer = function(string) {
  let score = 0;
  let object;
  for(let i = 0; i < roster.length; i++) {
    let fuzzyScore = fuzzy(string, roster[i].fullname);
    if (fuzzyScore > score && fuzzyScore > 0.6) {
      score = fuzzyScore;
      object = roster[i];
    }
  }
  //for testing purposes
  //object.score = score;
  return object;
}

module.exports = utilities;