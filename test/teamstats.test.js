const expect = require("chai").expect;
const teamstats = require("../lib/teamstats.js");

describe('Teamstats functions', function () {
    let input = 'OAK';
    
    it('getBreakdown function should return a string greater than 300', function () {
      let stats = teamstats.getBreakdown(input);
      return expect(stats).to.have.length.above(300);
    });

    it('getTargets function should return a string length greater than 300', function(){
      let targets = teamstats.getTargets(input);
      return expect(targets).to.have.length.above(300);
    });
});