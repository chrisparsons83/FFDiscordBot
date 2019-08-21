const sleeperPlayers = require('../stats/sleeper.json');
const fs = require('fs')


fs.writeFile('../stats/sleeper.json', JSON.stringify(sleeperPlayers, null, 2), (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('done!')
  }
})