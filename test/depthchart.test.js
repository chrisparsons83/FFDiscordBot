const expect = require("chai").expect;
const depthchart = require("../lib/depthchart.js");

describe('depthchart library', function () {
  it('Should return a non-empty object', function () {
      let teamname = 'JAX';
      return depthchart.getRoster(teamname).then(function(value) {
        expect(value.qb).to.be.not.empty;
      });
  });
});