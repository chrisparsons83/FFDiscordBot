const expect = require("chai").expect;
const boris = require("../lib/borischen.js");

describe('Boris library', function () {
  it('Should return an array with length greater than 3', function () {
      let position = 'k';
      let scoring = 'half';
      return boris.getTier(position, scoring).then(function(value) {
        expect(value).to.have.length.above(3);
      });
  });
});