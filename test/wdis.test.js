const expect = require('chai').expect;
const commands = require('../lib/commands.js');

describe('Rankplayer Utilities', () => {
  it('Should return the highest ranked player', () => {
    const string = 'wr, full, robby anderson , michael thomas , ty hilton';
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
    const string = 'wr, full, ty hilton, , robby anderson';
    return commands['!wdis'](string).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Should complain when args are less than 2', () => {
    const string = 'defense';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid query.\nValid positions are ***qb, rb, te, k, dst, flex.***\nValid scoring are ***standard, half, full.***');
    });
  });

  it('Should complain about a player not existing', () => {
    const string = 'wr, full, jennifer lopez , pam oliver';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('One of these player doesn\'t exist in the players database');
    });
  });

  it('Should complain when mixing a non-existent player with one valid player', () => {
    const string = 'wr, full, michael thomas , pam oliver';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('One of these player doesn\'t exist in the players database');
    });
  });

  it('Should complain when mixing a non-existent player with one valid player', () => {
    const string = 'qb,  aaron rodgers , pam oliver';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('One of these player doesn\'t exist in the players database');
    });
  });

  it('Dst should be valid', () => {
    const string = 'dst, nyg, den';
    return commands['!wdis'](string).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Non-format required position should be valid', () => {
    const string = 'qb, aaron rodgers, tom brady';
    return commands['!wdis'](string).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Blank players should be rejected with error message', () => {
    const string = 'wr, full, , , ,';
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
      expect(err).to.equal('One or more players doesn\'t match the position they play in.');
    });
  });

  it('Invalid player position should be rejected with error message', () => {
    const string = 'qb, adrian peterson';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('One or more players doesn\'t match the position they play in.');
    });
  });

  it('Invalid team symbols should be rejected with error message', () => {
    const string = 'dst, nyk , nyc';
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
      expect(err).to.equal('Invalid position entered.\nValid positions are ***qb, rb, wr, te, k, dst, flex***');
    });
  });

  it('Incorrect scoring format should be rejected with error message', () => {
    const string = 'rb, halfppr, jordan howard';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Missing scoring format.\nValid format are ***standard, half,*** or ***full.***');
    });
  });

  it('empty query should be rejected with error message', () => {
    const string = 'rb, full';
    return commands['!wdis'](string).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Please give me players to rank from!');
    });
  });
});
