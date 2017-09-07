const expect = require('chai').expect;
const boris = require('../lib/borischen.js');
const commands = require('../lib/commands.js');

describe('Boris library and commands', () => {
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

  it('Non-scoring format required should return an embed object', () => {
    const string = 'qb';
    return commands['!boris'](string).then((obj) => {
      expect(Object.keys(obj).length).to.equal(1);
      expect(Object.keys(obj.embed).length).to.equal(5);
      expect(obj.embed.title).to.be.not.empty;
      expect(obj.embed.color).to.be.not.empty;
      expect(obj.embed.url).to.be.not.empty;
      expect(obj.embed.thumbnail).to.be.not.empty;
      expect(obj.embed.fields).to.be.not.empty;
    });
  });

  it('Should complain when the position is invalid', () => {
    const string = 'qr';
    return commands['!boris'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid position entered.');
    });
  });

  it('Should complain when missing scoring format if the position requires it', () => {
    const string = 'wr';
    return commands['!boris'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid position/format.\nValid positions are ***qb, rb, wr, te, k , dst***.\nValid scoring formats are ***standard, half, full***');
    });
  });

  it('Should complain when a invalid scoring format was entered', () => {
    const string = 'wr, halfsf';
    return commands['!boris'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid position/format.\nValid positions are ***qb, rb, wr, te, k , dst***.\nValid scoring formats are ***standard, half, full***');
    });
  });

});
