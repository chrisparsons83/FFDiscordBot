const expect = require("chai").expect;
const utilities = require("../lib/utilities");

describe('Bot Utilities', function () {
    it('Should return one item when given a chooseOne', () => {
        let chooseList = 'beer, wine, liquor';
        let chooseListArray = ['beer', 'wine', 'liquor'];
        return utilities.chooseOne(chooseList).then(function (value) {
            expect(chooseListArray).to.include(value);
        });
    });

    it('Should complain when choosingOne without commas', () => {
        let chooseList = 'beer wine liquor';
        return utilities.chooseOne(chooseList).then(function (value) {
            expect(value).to.equal("Please use commas to separate your choices.");
        });
    });

    it('Should return a string when asking the 8-ball', () => {
        return utilities.eightBall().then(function (value) {
            expect(value).to.be.a('string');
        })
    });
});