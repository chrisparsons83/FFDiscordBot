const expect = require('chai').expect;
const rotoworld = require('../lib/rotoworld');

describe('Rotoworld Integration', () => {
  it("Should find a valid NFL player with form 'lastname, firstname'", () => {
    const playerName = 'Wilson, Russell';
    return rotoworld.getPlayer(playerName).then((values) => {
      expect(values[0]).to.not.be.false;
    });
  });

  it("Should find a valid NFL player with form 'firstname lastname'", () => {
    const playerName = 'Russell Wilson';
    return rotoworld.getPlayer(playerName).then((values) => {
      expect(values[0]).to.not.be.false;
    });
  });

  it('Should find the correct player with a name like David Johnson', () => {
    const playerName = 'David Johnson';
    return rotoworld.getPlayer(playerName).then((values) => {
      expect(values[0]).to.not.be.false;
    });
  });

  it('Should still find the correct player with a name like David Johnston', () => {
    const playerName = 'David Johnston';
    return rotoworld.getPlayer(playerName).then((values) => {
      expect(values[0]).to.not.be.false;
    });
  });

  it('Should find the correct exception player with a name like Mike Williams', () => {
    const playerName = 'Mike Williams';
    return rotoworld.getPlayer(playerName).then((values) => {
      expect(values[0]).to.not.be.false;
    });
  });

  it('NFL player should have correct data associated with the player', () => {
    const playerName = 'Wilson,Russell';
    return rotoworld.getPlayer(playerName).then((values) => {
      expect(values.name).to.equal('Russell Wilson');
      expect(values.position).to.equal('Quarterback');
      expect(values.number).to.equal('#3');
      expect(values.team).to.equal('Seattle Seahawks');
      expect(values.college).to.equal('Wisconsin');
      expect(values.drafted).to.equal('2012 / Rd. 3 (75)  / SEA');
    });
  });

  it('Should find the correct exception player Buck Allen', () => {
    const playerName = 'Buck Allen';
    return rotoworld.getPlayer(playerName).then((values) => {
      expect(values[0]).to.not.be.false;
    });
  });


  it('Should not find an invalid NFL player', () => {
    const playerName = 'Beesly,Pam';
    return rotoworld.getPlayer(playerName).catch((values) => {
      expect(values).to.equal('There is no player found with that name.');
    });
  });

  it('Should find Alex Smith when using zzz', () => {
    const playerName = 'zzz';
    return rotoworld.getPlayer(playerName).then((values) => {
      expect(values.name).to.equal('Alex Smith');
    });
  });
});
