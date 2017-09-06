const expect = require('chai').expect;
const espn = require('../lib/espn');

describe('ESPN Utilities', () => {
  it('Should return the next 5 games from a lowercase team abbreviation', () => {
    const teamName = 'lar';
    return espn.next5(teamName).then((value) => {
      expect(value.schedule).to.have.lengthOf(5);
    });
  });

  it('Should return the next 5 games from an uppercase team abbreviation', () => {
    const teamName = 'NYG';
    return espn.next5(teamName).then((value) => {
      expect(value.schedule).to.have.lengthOf(5);
    });
  });

  it('Should return the next 5 games from a valid team mascot', () => {
    const teamName = 'Seahawks';
    return espn.next5(teamName).then((value) => {
      expect(value.schedule).to.have.lengthOf(5);
    });
  });

  it('Should return an error with an invalid team abbreviation', () => {
    const teamName = 'abc';
    return espn.next5(teamName).catch((value) => {
      expect(value).to.equal('No team name was found.');
    });
  });

  it('Should return an object with an array schedule for a full', () => {
    const teamName = 'Seahawks';
    return espn.remainingGames(teamName).catch((value) => {
      expect(value.remainingGames).to.be.a('array');
    });
  });
});
