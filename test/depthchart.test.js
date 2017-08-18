const expect = require("chai").expect;
const depthchart = require("../lib/depthchart.js");

describe('depthchart library', function () {
  it('Should return an embed object', function () {
    let teamname = 'JAX';
    let position = 'qb'
    return depthchart.getRoster(teamname, position).then(function(value) {
     expect(value.embed).to.be.not.empty;
    });
  });

});