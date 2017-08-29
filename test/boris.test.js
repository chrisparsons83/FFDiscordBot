const expect = require('chai').expect;
const boris = require('../lib/borischen.js');

describe('Boris library', () => {
  it('getTier should return wide receiver tiers with full scoring format object', () => {
    const position = 'wr';
    const scoring = 'full';
    return boris.getTier(position, scoring).then((value) => {
      expect(Object.keys(value).length).to.equal(4);
      expect(value.string).to.be.not.empty;
      expect(value.position).to.be.a.string;
      expect(value.url).to.be.a.string;
      expect(value.thumbnail).to.be.a.string;
    });
  });

  it('getTier should return tight end tiers with half scoring format object', () => {
    const position = 'te';
    const scoring = 'half';
    return boris.getTier(position, scoring).then((value) => {
      expect(Object.keys(value).length).to.equal(4);
      expect(value.string).to.be.not.empty;
      expect(value.position).to.be.a.string;
      expect(value.url).to.be.a.string;
      expect(value.thumbnail).to.be.a.string;
    });
  });

  it('getTier should return running back tiers with standard scoring format object', () => {
    const position = 'rb';
    const scoring = 'standard';
    return boris.getTier(position, scoring).then((value) => {
      expect(Object.keys(value).length).to.equal(4);
      expect(value.string).to.be.not.empty;
      expect(value.position).to.be.a.string;
      expect(value.url).to.be.a.string;
      expect(value.thumbnail).to.be.a.string;
    });
  });

});
