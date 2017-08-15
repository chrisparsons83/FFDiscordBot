const expect = require("chai").expect;
const depthchart = require("../lib/depthchart.js");

describe('depthchart library', function () {
  it('Should return a non-empty object', function () {
      let teamname = 'NYG';
      let position = 'qb';
      return depthchart.getRoster(teamname).then(function(value) {
        expect(value).to.not.empty;
      });
  });
});