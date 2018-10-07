const expect = require('chai').expect;
const teamstats = require('../lib/teamstats.js');

describe('Teamstats functions', () => {
  const input = 'OAK';
  const type = 'right';
  it('getBreakdown function should return a team stats object', () => {
    const stats = teamstats.getBreakdown(input);
    expect(Object.keys(stats).length).to.equal(10);
    expect(stats.offensivePlay).to.be.a.string;
    expect(stats.passingPercentage).to.be.a.string;
    expect(stats.passingYards).to.be.a.string;
    expect(stats.yardsPerPass).to.be.a.string;
    expect(stats.shortPass).to.be.a.string;
    expect(stats.deepPass).to.be.a.string;
    expect(stats.rushingPercentage).to.be.a.string;
    expect(stats.rushingYards).to.be.a.string;
    expect(stats.yardsPerRush).to.be.a.string;
  });

  it('getTargets function should return a string length greater than 300', () => {
    const targets = teamstats.getTargets(input, type);
    return expect(targets).to.have.length.above(75);
  });
});
