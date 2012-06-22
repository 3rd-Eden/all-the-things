'use strict';

var EventEmitter = require('events').EventEmitter;

/**
 * A net.Stream connection pool.
 *
 * @constructor
 * @param {Number} limit
 * @api public
 */

function Manager(limit) {
  this.limit = limit || 10; // defaults to 10 connections max
  this.pool = [];
  this.generator = null;
}

/**
 * Add a stream generator so we can generate streams for the pool.
 *
 * @param {Function} builder
 * @api public
 */

Manager.prototype.factory = function factory(builder) {
  if (typeof builder !== 'function') {
    throw new Error('The #factory requires a function');
  }

  this.generator = builder;
};

/**
 * Allocate a new connection from the connection pool, this can be done async
 * that's why we use a error first callback pattern.
 *
 * @param {Function} fn
 * @api public
 */

Manager.prototype.allocate = function allocate(fn) {
  if (!this.generator) return fn(new Error('Specify a stream #factory'));

  var probabilities = []
    , self = this
    , total, i, probability, connection;

  i = total = this.pool.length;

  // check the current pool if we already have a few connections available, so
  // we don't have to generate a new connection
  while (i--) {
    connection = this.pool[i];
    probability = this.isAvailable(connection);

    // we are sure this connection works
    if (probability === 100) return fn(undefined, connection);

    // no accurate match, add it to the queue as we can get the most likely
    // available connection
    probabilities.push({
        probability: probability
      , index: i
    });
  }

  // we didn't find a confident match, see if we are allowed to generate a fresh
  // connection
  if (this.pool.length < this.limit) {
    // determin if the function expects a callback or not, this can be done by
    // checking the length of the given function, as the amount of args accepted
    // equals the length..
    if (this.generator.length === 0) {
      connection = this.generator();
      if (connection) return fn(undefined, connection);
    } else {
      return this.generator(function generate(err, connection) {
        if (err) return fn(err);
        if (!connection) return fn(new Error('The #factory failed to generate a stream'));

        self.pool.push(connection);
        return fn(undefined, connection);
      });
    }
  }

  // o, dear, we got issues.. we didn't find a valid connection and we cannot
  // create more.. so we are going to check if we might have semi valid
  // connection by sorting the probabilities array and see if it has
  // a probability above 60
  probability = probabilities.sort(function sort(a, b) {
    return a.probability - b.probability;
  }).pop();

  if (probability && probability.probability >= 60) {
    return fn(undefined, this.pool[probability.index]);
  }

  // well, that didn't work out, so assume failure
  fn(new Error('The connection pool is full'));
};

/**
 * Check if a connection is available for writing.
 *
 * @param {net.Connection} net
 * @returns {Number} probability that his connection is available or will be
 * @api private
 */

Manager.prototype.isAvailable = function isAvailable(net) {
  var readyState = net.readyState
    , writable = readyState === 'open' || readyState === 'writeOnly'
    , writePending = net._pendingWriteReqs || 0
    , writeQueue = net._writeQueue || []
    , writes = writeQueue.length || writePending;

  // if the stream is writable and we don't have anything pending we are 100%
  // sure that this stream is available for writing
  if (writable && writes === 0) return 100;

  // if the stream isn't writable we aren't that sure..
  if (!writable) return 0;

  // the connection is still opening, so we can write to it in the future
  if (readyState === 'opening') return 70;

  // we have some writes, so we are going to substract that amount from our 100
  if (writes < 100) return 100 - writes;

  // we didn't find any relaiable states of the stream, so we are going to
  // assume something random, because we have no clue, so generate a random
  // number between 0 - 70
  return Math.floor(Math.random() * 50);
};

/**
 * Release the connection from the connection pool.
 *
 * @param {Stream} net
 * @returns {Boolean} was the removal successful
 * @api public
 */

Manager.prototype.release = function release(net) {
  var index = this.pool.indexOf(net)
    , open = net.readyState && net.readyState !== 'closed';

  // no match
  if (index === -1) return false;

  this.pool.splice(net, 1);
  if (net.end) net.end();

  return true;
};
