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

    it('Should return david johnson', () => {
        let player = 'david johnson';
        let object = utilities.findPlayer(player);
        expect(object.fullname).to.equal('david johnson');
    });

    it('Should return josh gordon', () => {
        let player = 'josh gordon';
        let object = utilities.findPlayer(player);
        expect(object.fullname).to.equal('josh gordon');
    });

    it('Should return adrian peterson', () => {
        let player = 'adrian peterson';
        let object = utilities.findPlayer(player);
        expect(object.fullname).to.equal('adrian peterson');
    });      

    it('Jennifer lopez as a player should return undefined', () => {
        let player = 'jennifer lopez';
        let object = utilities.findPlayer(player);
        //console.log(object === false);
        expect(object).to.be.undefined;
    });

});