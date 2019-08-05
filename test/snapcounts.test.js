const expect = require('chai').expect;
const snapcounts = require('../lib/snapcounts.js');
const commands = require('../lib/commands.js');

describe('Snapcount library and commands', () => {

  it('Should complain when there are less than 3 arguments', () => {
    const object = {
      args: 'jax, wr'
    };
    return commands['!snaps'](object).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Missing an argument. Please check your query. `!snaps team, pos, week, year`');
    });
  });

  it('Should complain when there are arguments are undefined', () => {
    const object = {
      args: undefined
    };
    return commands['!snaps'](object).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('I hate empty queries.');
    });
  });

  it('Should complain when team is invalid', () => {
    const object = {
      args: 'jay, wr, 12'
    };
    return commands['!snaps'](object).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid team symbol entered.');
    });

  });

  it('Should complain when invalid position is entered', () => {
    const object = {
      args: 'jax, ol, 12'
    };
    return commands['!snaps'](object).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid position entered.');
    });
  });

  it('Should complain when invalid week is entered', () => {
    const object = {
      args: 'jax, wr, 23'
    };
    return commands['!snaps'](object).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid week entered.');
    });
  });  
 
  it('Should complain when invalid year is entered', () => {
    const object = {
      args: 'jax, rb, 1, 2001'
    };
    return commands['!snaps'](object).then(() => {
    }).catch((err) => {
      expect(err).to.be.a.string;
      expect(err).to.equal('Invalid year entered. No data available yet for the year selected.');
    });
  });  

});
