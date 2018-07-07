const expect = require('chai').expect;
const commands = require('../lib/commands.js');

describe('Poll command test ', () => {
  it('Should complain when there are not enough answers.', () => {
    const pollObject = {
      args: 'Is lamar miller a bust? | yes ',
    };
    return commands['!poll'](pollObject)
      .then(() => {
      })
      .catch((err) => {
        expect(err).to.equal('Invalid poll. Please check your questions/answers.');
      });
  });
});
