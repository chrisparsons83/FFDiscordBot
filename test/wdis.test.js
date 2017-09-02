const expect = require('chai').expect;
const commands = require('../lib/commands.js');

describe('Rankplayer Utilities', () => {
  it('Should return the highest ranked player', () => {
    const string = 'wr, full, robby anderson | michael thomas | ty hilton';
    return commands['!wdis'](string).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Should return the only player if only one player name was given', () => {
    const string = 'wr, full, ty hilton';
    return commands['!wdis'](string).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Whitespace should be ignored if query is valid', () => {
    const string = 'wr, full, ty hilton | | robby anderson';
    return commands['!wdis'](string).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('None existing players should still return a player name', () => {
    const string = 'wr, full, jennifer lopez | pam oliver';
    return commands['!wdis'](string).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('None existing player with one valid player should still return a player name', () => {
    const string = 'wr, full, michael thomas | pam oliver';
    return commands['!wdis'](string).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Dst should be valid', () => {
    const string = 'dst, full, nyg | den';
    return commands['!wdis'](string).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Blank players should be rejected with error message', () => {
    const string = 'wr, full, | | |';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Please give me players to rank from!');
    });
  });

  it('Invalid player position should be rejected with error message', () => {
    const string = 'wr, full, adrian peterson';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid player position.');
    });
  });

  it('Invalid team symbols should be rejected with error message', () => {
    const string = 'dst, full, nyk | nyc';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid team symbol. Please double check the team symbol.');
    });
  });

  it('Incorrect position should be rejected with error message', () => {
    const string = 'wb, full, jordan howard';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid position/format. Please check your position/format.');
    });
  });

  it('Incorrect scoring format should be rejected with error message', () => {
    const string = 'rb, halfppr, jordan howard';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid position/format. Please check your position/format.');
    });
  });

  it('invalid query should be rejected with error message', () => {
    const string = 'rb, full';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid query. Missing commas/position/scoring format/players.');
    });
  });
});
