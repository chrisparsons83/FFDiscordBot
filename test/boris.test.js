const expect = require("chai").expect;
const boris = require("../lib/borischen.js");

describe('Boris library', function () {
  it('Should return an embed object', function () {
      let position = 'wr';
      let scoring = 'half';
      return boris.getTier(position, scoring).then(function(value) {
        expect(value.embed).to.be.not.empty;
      });
  });
});