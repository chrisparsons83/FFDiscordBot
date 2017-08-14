const expect = require("chai").expect;
const lib4for4 = require("../lib/4for4");
const moment = require("moment");

describe('4for4 Utilities', function () {
    let validPlayer = "David Johnson";
    let validLowercasePlayer = "david johnson";
    let invalidPlayer = "Bob Dole";

    it('Should return a date in the past for the last updated date', () => {
        return lib4for4.getADP(validPlayer).then(function (value) {
            expect(value.LastUpdated).to.be.a('string');
            expect(value.LastUpdated).to.not.be.empty;
        });
    });

    it('Should return the team name for a valid player', () => {
        return lib4for4.getADP(validPlayer).then(function (value) {
            expect(value.Team).to.be.a('string');
            expect(value.Team).to.equal('ARI');
        });
    });

    it('Should return the ESPN ranking for a valid player', () => {
        return lib4for4.getADP(validPlayer).then(function (value) {
            expect(value.ADP.ESPN).to.be.a('number');
            expect(value.ADP.ESPN).to.be.greaterThan(0);
        });
    });

    it('Should return the Yahoo ranking for a valid player', () => {
        return lib4for4.getADP(validPlayer).then(function (value) {
            expect(value.ADP.Yahoo).to.be.a('number');
            expect(value.ADP.Yahoo).to.be.greaterThan(0);
        });
    });

    it('Should return the MFL ranking for a valid player', () => {
        return lib4for4.getADP(validPlayer).then(function (value) {
            expect(value.ADP.MFL).to.be.a('number');
            expect(value.ADP.MFL).to.be.greaterThan(0);
        });
    });

    it('Should return the NFL ranking for a valid player', () => {
        return lib4for4.getADP(validPlayer).then(function (value) {
            expect(value.ADP.NFL).to.be.a('number');
            expect(value.ADP.NFL).to.be.greaterThan(0);
        });
    });

    it('Should return the rankings for a valid player using all lowercase', () => {
        return lib4for4.getADP(validLowercasePlayer).then(function (value) {
            expect(value.LastUpdated).to.be.a('string');
            expect(value.LastUpdated).to.not.be.empty;
        });
    });

    it('Should return an error with an invalid player', () => {
        return lib4for4.getADP(invalidPlayer).catch(function (value) {
            expect(value).to.equal("No player found. Please check your spelling, or he may be outside the top 300.");
        });
    });
});