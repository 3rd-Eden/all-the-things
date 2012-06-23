/*globals expect */
describe('connectionpool', function () {
  'use strict';

  var ConnectionPool = require('../lib/connectionpool');

  it('should exported as a function', function () {
    expect(ConnectionPool).to.be.a('function');
  });
});
