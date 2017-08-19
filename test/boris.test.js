const expect = require('chai').expect;
const boris = require('../lib/borischen.js');

describe('Boris library', () => {
    it('Should return an object with string, position, url, and thumbnail as valid keys and values', () => {
        const position = 'wr';
        const scoring = 'half';
        return boris.getTier(position, scoring).then((value) => {
            expect(value.string).to.be.not.empty;
            expect(value.position).to.be.a.string;
            expect(value.url).to.be.a.string;
            expect(value.thumbnail).to.be.a.string;
        });
    });
});
