const expect = require('chai').expect;
const request = require('request');
const lib4for4 = require('../lib/4for4');
const sinon = require('sinon');

describe('4for4 Utilities', () => {
  const validPlayer = 'David Johnson';
  const validLowercasePlayer = 'david johnson';
  const invalidPlayer = 'Bob Dole';
  const playerWithQuote = 'Le\'veon Bell'
  const playerWithDash = 'Juju Smith-schuster'

  before((done) => {
    const url = 'https://www.4for4.com/fantasy-football/adp?paging=0';
    request.get(url, (error, response, html) => {
      sinon.stub(request, 'get')
        .yields(null, null, html);
      done();
    });
  });

  after((done) => {
    request.get.restore();
    done();
  });

  it('Should return a date in the past for the last updated date', () => lib4for4.getADP(validPlayer).then((value) => {
    expect(value.LastUpdated).to.be.a('string');
    expect(value.LastUpdated).to.not.be.empty;
  }));

  it('Should return the team name for a valid player', () => lib4for4.getADP(validPlayer).then((value) => {
    expect(value.Team).to.be.a('string');
    expect(value.Team).to.equal('ARI');
  }));

  it('Should return the ESPN ranking for a valid player', () => lib4for4.getADP(validPlayer).then((value) => {
    expect(value.ADP.ESPN).to.be.a('number');
    expect(value.ADP.ESPN).to.be.greaterThan(0);
  }));

  it('Should return the Yahoo ranking for a valid player', () => lib4for4.getADP(validPlayer).then((value) => {
    expect(value.ADP.Yahoo).to.be.a('number');
    expect(value.ADP.Yahoo).to.be.greaterThan(0);
  }));


  // it('Should return the NFL ranking for a valid player', () => lib4for4.getADP(validPlayer).then((value) => {
    // expect(value.ADP.NFL).to.be.a('number');
    // expect(value.ADP.NFL).to.be.greaterThan(0);
  // }));

  it('Should return the rankings for a valid player using all lowercase', () => lib4for4.getADP(validLowercasePlayer).then((value) => {
    expect(value.LastUpdated).to.be.a('string');
    expect(value.LastUpdated).to.not.be.empty;
  }));

  it('Should return the Yahoo ranking for Le\'veon Bell even with the single quotation mark in his name', () => lib4for4.getADP(playerWithQuote).then((value) => {
    expect(value.ADP.Yahoo).to.be.a('number');
    expect(value.ADP.Yahoo).to.be.greaterThan(0);
  }));

  it('Should return the Yahoo ranking for Juju Smith-Schuster even with the dash in his name', () => lib4for4.getADP(playerWithDash).then((value) => {
    expect(value.ADP.Yahoo).to.be.a('number');
    expect(value.ADP.Yahoo).to.be.greaterThan(0);
  }));

  it('Should return an error with an invalid player', () => lib4for4.getADP(invalidPlayer).catch((value) => {
    expect(value).to.equal('No player found. Please check your spelling, or he may be outside of the top 250.');
  }));
});
