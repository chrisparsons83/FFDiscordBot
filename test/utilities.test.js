const expect = require('chai').expect;
const utilities = require('../lib/utilities');

describe('Bot Utilities', () => {
  it('Should return one item when given a chooseOne', () => {
    const chooseList = 'beer, wine, liquor';
    const chooseListArray = ['beer', 'wine', 'liquor'];
    return utilities.chooseOne(chooseList).then((value) => {
      expect(chooseListArray).to.include(value);
    });
  });

  it('Should complain when choosingOne without commas', () => {
    const chooseList = 'beer wine liquor';
    return utilities.chooseOne(chooseList).catch((value) => {
      expect(value).to.equal('Please use commas to separate your choices.');
    });
  });

  it('Should return a string when asking the 8-ball', () => utilities.eightBall().then((value) => {
    expect(value).to.be.a('string');
  }));

  it('Should return david johnson', () => {
    const player = 'david johnson';
    const object = utilities.findPlayer(player);
    expect(object.fullname).to.equal('david johnson');
  });

  it('Should return josh gordon', () => {
    const player = 'josh gordon';
    const object = utilities.findPlayer(player);
    expect(object.fullname).to.equal('josh gordon');
  });

  it('Should return adrian peterson', () => {
    const player = 'adrian peterson';
    const object = utilities.findPlayer(player);
    expect(object.fullname).to.equal('adrian peterson');
  });

  it('Should return david johnson', () => {
    const player = 'david johnston';
    const object = utilities.findPlayer(player);
    expect(object.fullname).to.equal('david johnson');
  });

  it('Should return mike williams', () => {
    const player = 'mike williams';
    const object = utilities.findPlayer(player);
    expect(object.fullname).to.equal('mike williams');
  });

  it('Jennifer lopez as a player should return undefined', () => {
    const player = 'jennifer lopez';
    const object = utilities.findPlayer(player);
    expect(object).to.be.undefined;
  });
});
