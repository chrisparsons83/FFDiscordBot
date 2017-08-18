const expect = require("chai").expect;
const teamstats = require("../lib/teamstats.js");

describe('Teamstats functions', function () {
    let input = 'OAK';
    let teamname = 'Oakland Raiders'
    it('getBreakdown function should return a discord embed object', function () {
      let object = teamstats.getBreakdown(teamname, input);
      //return expect(object.embed).to.be.not.empty;
    });

    it('getTargets function should return a string length greater than 300', function(){
      let targets = teamstats.getTargets(input);
      return expect(targets).to.have.length.above(300);
    });
});