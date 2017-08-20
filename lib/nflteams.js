const nflteamsdata = require('../stats/nflteamsdata');

/**
 * Gets the NFL team corresponding to the string in question.
 * @param {string} teamstring - Search query.
 */
exports.getTeam = (teamString, callback) => {
  let err = '';
  let result = {};

  // Loop through each team in order to see if we have a match.
  // We need to loop through all teams, because if we have a situation
  // such as New York or Los Angeles with two teams, we want to throw
  // back a "Yo, you need to be more specific".
  const teamsReturn = nflteamsdata.filter((team) => {
    // We want to compare all properties inside the object.
    let match = false;
    Object.keys(team).some((prop) => {
      // Check to see if we have a match. If we do, then return true
      // will stop the loop.
      match = (team[prop].toLowerCase() === teamString.toLowerCase());
      return match;
    });
    return match;
  });

  // If we don't have exactly one team, let's return a usable error for them.
  if (teamsReturn.length !== 1) {
    err = 'No team name was found.';
  } else {
    result = teamsReturn[0];
  }

  return callback(err, result);
};
