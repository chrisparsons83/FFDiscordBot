var utilities = {};

const eightBallAnswers = [
    'Nope.',
    'Definitely.',
    'Hmmm...good question ;)',
    '...LMAO',
    '...You\'re joking, right?',
    'Holy CRAP yes',
    'Meh, why not?',
    'Only on Tuesdays.',
    'AFFIRMATIVE.',
    'Not in a million years.',
    'Ya never know...',
    'What do I look like, a fortune teller?',
    'What do I look like, a SMART bot?!',
    'You bet!',
    'I don\'t know, consult the oracle.',
    'BAHAHAHAHAHA IN YOUR DREAMS',
    'Hmmm...yes yes, I could see it to be tru-- wait nope nevermind.',
    'Do you WANT me to smack you??'
];

utilities.chooseOne = function (chooseList) {
    return new Promise(function (resolve, reject) {
        // Create array from string
        chooseListArray = chooseList.split(',');
        resolve(chooseListArray[Math.floor(Math.random() * chooseListArray.length)]);
    });
};

utilities.eightBall = function () {
    return new Promise(function (resolve, reject) {
        // Create array from string
        resolve(eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)]);
    });
};

module.exports = utilities;