var expect = require("chai").expect;
var assert = require("chai").assert;
var espn = require("../lib/espn");

describe('ESPN Utilities', function () {
    it('Should return the next 5 games from a lowercase team abbreviation', function () {
        var teamName = 'la';
        espn.next5(teamName).then(function (value) {
            expect(value.schedule).to.have.lengthOf(5);
        });
    });

    it('Should return the next 5 games from an uppercase team abbreviation', function () {
        var teamName = 'MIA';
        espn.next5(teamName).then(function (value) {
            expect(value.schedule).to.have.lengthOf(5);
        });
    });

    it('Should return the next 5 games from a valid team mascot', function () {
        var teamName = 'Seahawks';
        espn.next5(teamName).then(function (value) {
            expect(value.schedule).to.have.lengthOf(5);
        });
    });
});