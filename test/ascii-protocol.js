/*globals expect */
describe('ascii-protocol', function () {
  'use strict';

  var Protocol = require('../lib/protocol/ascii');

  it('should be an instance of Stream', function () {
    expect(new Protocol).to.be.an.instanceof(require('stream'));
  });
});
