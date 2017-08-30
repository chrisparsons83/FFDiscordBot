const expect = require('chai').expect;
const commands = require('../lib/commands.js');

describe('Poll command test ', () => {

  it('Should return an url from strawpoll api call.', () => {
    const input = 'Is lamar miller a bust? yes | no | maybe so. | I hate you';
    return commands['!poll'](input).then((res) => {
      expect(res).to.match(/http?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}/);
    });
  });

  it('Should complain when there are not enough answers.', () => {
    const input = 'Is lamar miller a bust? | yes ';
    return commands['!poll'](input)
      .then(() => {
      })
      .catch((err) => {
        expect(err).to.equal('Invalid poll. Please check your questions/answers.')
      });
  });
});
