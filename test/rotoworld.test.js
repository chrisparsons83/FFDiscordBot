var expect = require("chai").expect;
var rotoworld = require("../lib/rotoworld");

describe('Rotoworld Integration', function () {
    it('Should find a valid NFL player with form \'lastname, firstname\'', () => {
        let playerName = 'Wilson, Russell';
        return rotoworld.getPlayer(playerName).then(function (values) {
            expect(values[0]).to.not.be.false;
        });
    });

    it('Should find a valid NFL player with form \'firstname lastname\'', () => {
        let playerName = 'Russell Wilson';
        return rotoworld.getPlayer(playerName).then(function (values) {
            expect(values[0]).to.not.be.false;
        });
    });

    it('Should find the correct player with a name like David Johnson', () => {
        let playerName = 'David Johnson';
        return rotoworld.getPlayer(playerName).then(function (values) {
            expect(values[0]).to.not.be.false;
        });
    });

    it('Should still find the correct player with a name like David Johnston', () => {
      let playerName = 'David Johnston';
      return rotoworld.getPlayer(playerName).then(function (values) {
          expect(values[0]).to.not.be.false;
      });
    });

    it('find the correct exception player with a name like mike williams', () => {
      let playerName = 'Bike Williams';
      return rotoworld.getPlayer(playerName).then(function (values) {
          expect(values[0]).to.not.be.false;
      });
    });    

    it('NFL player should have correct data associated with the player', () => {
        let playerName = 'Wilson,Russell';
        return rotoworld.getPlayer(playerName).then(function (values) {
            expect(values.name).to.equal("Russell Wilson");
            expect(values.position).to.equal("Quarterback");
            expect(values.number).to.equal("#3");
            expect(values.team).to.equal("Seattle Seahawks");
            expect(values.college).to.equal("Wisconsin");
            expect(values.drafted).to.equal("2012 / Rd. 3 (75)  / SEA");
        });
    });

    it('Should not find an invalid NFL player', () => {
        let playerName = 'Beesly,Pam';
        return rotoworld.getPlayer(playerName).catch(function (values) {
          expect(values).to.equal("There is no player found with that name.");
        });
    });
});