const expect = require("chai").expect;
const request = require('request');
const polly = require("../lib/polly.js");

describe('Poll using strawpoll', function () {
    it('Should return a url', function () {
        let question = 'Is lamar miller a bust?';
        let answers = ['yes','no','maybe so.', 'I hate you.'];
        return polly.getPoll(question, answers).then(function (value) {
            expect(value).to.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
        });
    });

});