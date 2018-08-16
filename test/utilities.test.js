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

  it('Should complain when there\'s only one item', () => {
    const chooseList = 'apple,';
    return utilities.chooseOne(chooseList).catch((value) => {
      expect(value).to.equal('Please give me at least two things to choose from - I like choices!');
    });
  });

  it('Should complain when the argument is only a comma', () => {
    const chooseList = ',';
    return utilities.chooseOne(chooseList).catch((value) => {
      expect(value).to.equal('Please give me at least two things to choose from - I like choices!');
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

  it('Should return todd gurley', () => {
    const player = 'todd gurley';
    const object = utilities.findPlayer(player);
    expect(object.fullname).to.equal('todd gurley');
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
  it('Should reject when given an empty list', () => {
    const list = '';
    return utilities.shuffle(list).catch((value) => {
      expect(value).to.equal('I need at least two items to shuffle!');
    });
  });
  it('Should reject when given a list of size of 1', () => {
    const list = 'a';
    return utilities.shuffle(list).catch((value) => {
      expect(value).to.equal('I need at least two items to shuffle!');
    });
  });
  it('Should reject when given a list of size of 1 with a comma', () => {
    const list = 'a,';
    return utilities.shuffle(list).catch((value) => {
      expect(value).to.equal('I need at least two items to shuffle!');
    });
  });
  it('Should reject when given a comma', () => {
    const list = 'a,';
    return utilities.shuffle(list).catch((value) => {
      expect(value).to.equal('I need at least two items to shuffle!');
    });
  });
  it('Shuffled items should have the same elements as the original items', () => {
    const list = 'beer, wine, liquor';
    const items = ['beer', 'wine', 'liquor'];
    return utilities.shuffle(list).then((shuffled) => {
      expect(items.sort().join(',')).to.equal(shuffled.sort().join(','));
    });
  });
});
