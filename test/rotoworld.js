var expect = require("chai").expect;
var assert = require("chai").assert;
var rotoworld = require("../lib/rotoworld");

describe('Rotoworld Integration', function () {
    it('Should find a valid NFL player with form \'lastname, firstname\'', function () {
        let playerName = 'Wilson, Russell';
        rotoworld.getPlayer(playerName).then(function (values) {
            expect(values[0]).to.not.be.false;
        }).catch(function (err) {
            assert.fail('NoError', 'Error', err);
        });
    });

    it('Should find a valid NFL player with form \'firstname lastname\'', function () {
        let playerName = 'Russell Wilson';
        rotoworld.getPlayer(playerName).then(function (values) {
            expect(values[0]).to.not.be.false;
        }).catch(function (err) {
            assert.fail('NoError', 'Error', err);
        });
    });

    it('NFL player should have correct data associated with the player', function () {
        let playerName = 'Wilson,%20Russell';
        rotoworld.getPlayer(playerName).then(function (values) {
            expect(values[0].name).to.equal("Russell Wilson");
            expect(values[0].position).to.equal("Quarterback");
            expect(values[0].number).to.equal("#3");
            expect(values[0].team).to.equal("Seattle Seahawks");
            expect(values[0].college).to.equal("Wisconsin");
        }).catch(function (err) {
            assert.fail('NoError', 'Error', err);
        });
    });

    it('Should not find an invalid NFL player', function () {
        let playerName = 'Beesly,%20Pam';
        rotoworld.getPlayer(playerName).then(function (values) {
            expect(values[0]).to.be.false;
        }).catch(function (err) {
            assert.fail('NoError', 'Error', err);
        });
    });
});