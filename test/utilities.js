var expect = require("chai").expect;
var assert = require("chai").assert;
var utilities = require("../lib/utilities");

describe('Bot Utilities', function() {
    it('Should return one item when given a chooseOne', function() {
        var chooseList = 'beer, wine, liquor';
        utilities.chooseOne(chooseList).then(function (value) {
            expect(chooseList.split(',')).to.include(value);
        });
    })
})
