const expect = require('chai').expect;
const nflteams = require('../lib/nflteams');

describe('NFL Teams Utility', () => {
  const validTeam = 'Seahawks';
  const ambiguousTeam = 'New York';
  const invalidTeam = 'Tokyo';

  it('Should return a team object for a valid team', () => nflteams.getTeam(validTeam, (err, teamObject) => {
    expect(err).to.be.empty;
    expect(teamObject.name).to.equal('Seattle Seahawks');
  }));

  it('Should return an error for an ambiguous location', () => nflteams.getTeam(ambiguousTeam, (err, teamObject) => {
    expect(err).to.equal('No team name was found.');
    expect(teamObject).to.be.empty;
  }));

  it('Should return an error for an invalid team', () => nflteams.getTeam(invalidTeam, (err, teamObject) => {
    expect(err).to.equal('No team name was found.');
    expect(teamObject).to.be.empty;
  }));
});
