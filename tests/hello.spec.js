require('mocha');
const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should;

describe('Hello', () => {
  it('Should say Hello World!', () => {
    const result = require('./hello')();
    expect(result).to.equal('Hello World!');
    expect(result).to.be.a('string');
  });
});