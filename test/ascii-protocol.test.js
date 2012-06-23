/*globals expect */
describe('ascii-protocol', function () {
  'use strict';

  var Protocol = require('../lib/protocol/ascii');

  it('should exported as a function', function () {
    expect(Protocol).to.be.a('function');
  });

  it('should be an instance of Stream', function () {
    expect(new Protocol()).to.be.an.instanceof(require('stream'));
  });

  it('should automatically convert strings to ints', function () {
    var parser = new Protocol('100');

    expect(parser.limit).to.be.a('number');
    expect(parser.limit).to.eql(100);
  });

  it('should be a writable stream', function () {
    var parser = new Protocol();

    expect(parser.writable).to.eql(true);
  });
});
