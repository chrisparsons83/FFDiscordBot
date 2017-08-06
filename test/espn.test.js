const expect = require("chai").expect;
const espn = require("../lib/espn");

describe('ESPN Utilities', function () {
    it('Should return the next 5 games from a lowercase team abbreviation', function () {
        let teamName = 'lar';
        return espn.next5(teamName).then(function (value) {
            expect(value.schedule).to.have.lengthOf(5);
        });
    });

    it('Should return the next 5 games from an uppercase team abbreviation', function () {
        let teamName = 'MIA';
        return espn.next5(teamName).then(function (value) {
            expect(value.schedule).to.have.lengthOf(5);
        });
    });

    it('Should return the next 5 games from a valid team mascot', function () {
        let teamName = 'Seahawks';
        return espn.next5(teamName).then(function (value) {
            expect(value.schedule).to.have.lengthOf(5);
        });
    });

    it('Should return an error with an invalid team abbreviation', function () {
        let teamName = 'abc';
        return espn.next5(teamName).catch(function (value) {
            expect(value).to.equal("No team name was found.");
        });
    });
});