const expect = require('chai').expect;
const commands = require('../lib/commands.js');


describe('Rankplayer Utilities', () => {
  
  it('Should return the highest ranked player', () => {
    const rankObject = {
      args: 'wr, full, antonio brown, ty hilton, robby anderson'
    };
    return commands['!wdis'](rankObject).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });
  

  it('Should return the only player if only one player name was given', () => {
    const rankObject = {
      args: 'wr, full, ty hilton',
    };
    return commands['!wdis'](rankObject).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Whitespace should be ignored if query is valid', () => {
    const rankObject = {
      args: 'wr, full, ty hilton, , robby anderson',
    };
    return commands['!wdis'](rankObject).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Should complain when args are less than 2', () => {
    const rankObject = {
      args: 'defense',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid query.\nValid positions are ***qb, rb, te, k, dst, flex.***\nValid scoring are ***standard, half, full.***');
    });
  });

  it('Should complain about a player not existing', () => {
    const rankObject = {
      args: 'wr, full, jennifer lopez , pam oliver',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('One of these player doesn\'t exist in the players database. Please use the player\'s full name.');
    });
  });

  it('Should complain when mixing a non-existent player with one valid player', () => {
    const rankObject = {
      args: 'wr, full, michael thomas , pam oliver',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('One of these player doesn\'t exist in the players database. Please use the player\'s full name.');
    });
  });

  it('Should complain when mixing a non-existent player with one valid player', () => {
    const rankObject = {
      args: 'qb,  aaron rodgers , pam oliver',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('One of these player doesn\'t exist in the players database. Please use the player\'s full name.');
    });
  });

  it('Dst should be valid', () => {
    const rankObject = {
      args: 'dst, nyg, den',
    };
    return commands['!wdis'](rankObject).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Non-format required position should be valid', () => {
    const rankObject = {
      args: 'qb, aaron rodgers, tom brady',
    };
    return commands['!wdis'](rankObject).then((msg) => {
      expect(msg).to.be.a.string;
    });
  });

  it('Blank players should be rejected with error message', () => {
    const rankObject = {
      args: 'wr, full, , , ,',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Please give me players to rank from!');
    });
  });

  it('Invalid player position should be rejected with error message', () => {
    const rankObject = {
      args: 'wr, full, leveon bell',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('One or more players doesn\'t match the position they play in.');
    });
  });

  it('Invalid player position should be rejected with error message', () => {
    const rankObject = {
      args: 'qb, leveon bell',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('One or more players doesn\'t match the position they play in.');
    });
  });

  it('Invalid team symbols should be rejected with error message', () => {
    const rankObject = {
      args: 'dst, nyk , nyc',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid team symbol/name. Please double check the team symbol/name.');
    });
  });

  it('Incorrect position should be rejected with error message', () => {
    const rankObject = {
      args: 'wb, full, jordan howard',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('You might be missing a comma or spelled the position wrong. \nValid positions are ***qb, rb, te, k, dst, flex.***');
    });
  });

  it('Incorrect scoring format should be rejected with error message', () => {
    const rankObject = {
      args: 'rb, halfppr, jordan howard',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Missing scoring format and/or comma.\nValid format are ***standard, half,*** or ***full.***');
    });
  });

  it('empty query should be rejected with error message', () => {
    const rankObject = {
      args: 'rb, full',
    };
    return commands['!wdis'](rankObject).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Please give me players to rank from!');
    });
  });
});
