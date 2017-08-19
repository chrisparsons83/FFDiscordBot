const expect = require("chai").expect;
const boris = require("../lib/borischen.js");

describe('Boris library', function () {
  it('getTier should return a value tier object', function () {
      let position = 'wr';
      let scoring = 'half';
      return boris.getTier(position, scoring).then(function(value) {
        expect(Object.keys(value).length).to.equal(4);
        expect(value.string).to.be.not.empty;
        expect(value.position).to.be.a.string;
        expect(value.url).to.be.a.string;
        expect(value.thumbnail).to.be.a.string;
      });
  });

});