'use strict';

/**
 * The parser is based on the work of Twitter, Inc
 *
 * - https://github.com/twitter/twemperf/blob/master/src/mcp_call.c
 * - https://github.com/twitter/twemproxy/blob/master/src/nc_parse.c
 *
 * Which is licensed under an APACHE-2 license.
 */

/**
 * Import the required modules
 */

var Stream = require('stream')
  , compare = require('./compare');

/**
 * Constants for the parser.
 *
 * @const
 * @api private
 */
var MAX_KEY_LENGTH = 250 // max length of a key
  , CR = '\r' // carriage return, printer return to beginning of new line
  , LF = '\n' // line feed, printer feed one line
  , CRLF = '\r\n'; // all above

function Parser (limit) {
  // parser information
  this.queue = '';                      // queue for parsed data
  this.limit = +limit;                  // byte limit that we can queue
  this.token = '';                      // current token
  this.state = Parser.states.START;     // the inital state is start
  this.type = '';

  // set the correct flags for the stream
  this.destroyed = false;
  this.writable = true;
  this.readable = false;

  Stream.call(this);
}

Parser.prototype = new Stream;
Parser.prototype.constructor = Parser;

/**
 * A new packet has been received from the underlaying connection.
 */
Parser.prototype.write = function write(chunk) {
  this.queue += chunk.toString('UTF-8');

  // parse the queue, so we might be able to reduce the length of the queue as
  // it would successfully remove a packet from the queue
  this.parse();

  // prevent buffering to much data
  if (Buffer.byteLength(this.queue) >= this.limit) {
    this.destroy();
    return false;
  }

  return true;
};

/**
 * The different states of parsing.
 *
 * @type {Object}
 * @api private
 */
Parser.states = Object.create(null);
[
    'START'
  , 'NUM'
  , 'STR'
  , 'SPACES_BEFORE_KEY'
  , 'FLAGS'
  , 'SPACES_BEFORE_VLEN'
  , 'VLEN'
  , 'GOTO_VAL'
  , 'VAL'
  , 'GOTO_END'
  , 'E'
  , 'EN'
  , 'END'
  , 'GOTO_CRLF'
  , 'CRLF'
  , 'ALMOST_DONE'
  , 'SENTINEL'
].forEach(function states(state, flag) {
  Parser.states[state] = flag;
});

/**
 * Attempt to parse a packet from the internal queue.
 */
Parser.prototype.parse = function parse() {
  if (!this.queue.length) return false;

  var flag = Parser.states
    , ch;

  switch (this.state) {
    case flag.START:
      this.state = ch >= 0 && ch <= 9
        ? flag.NUM
        : flag.STR;
      break;

    case flag.NUM:
      if (ch >= 0 && ch <= 9);
      else if (ch === ' ' || ch === CR) {

      }
      break;
    case flag.STR:
      break;
    case flag.SPACES_BEFORE_KEY:
      break;
    case flag.FLAGS:
      break;
    case flag.SPACES_BEFORE_VLEN:
      break;
    case flag.VLEN:
      break;
    case flag.GOTO_VAL:
      break;
    case flag.VAL:
      break;
    case flag.GOTO_END:
      break;
    case flag.E:
      break;
    case flag.EN:
      break;
    case flag.END:
      break;
    case flag.GOTO_CRLF:
      break;
    case flag.CRLF:
      break;
    case flag.ALMOST_DONE:
      break;
    case flag.SENTINEL:
      break;
  }
};

/**
 * Destroy the connection.
 */
Parser.prototype.destroy = function destroy(exception) {
  if (this.destroyed) return;

  this.queue = '';
  this.destroyed = true;

  var self = this;
  process.nextTick(function closing () {
    if (exception) self.emit('error', exception);

    self.emit('close', !!exception);
  });
};

/**
 * @TODO attempt to read the data from the queue and then commit suecide.
 */
Parser.prototype.destroySoon = Parser.prototype.destroy;

/**
 * Close the protocol.
 */
Parser.prototype.end = function end(chunk) {
  if (chunk) {
    // if the write was successful we can do a destroy, so we don't emit the
    // `close` event twice. In addition to this also check if we have something
    // in our queue, as it could be that we do more parsing
    if (this.write(chunk) && !this.queue.length) {
      this.destroy();
    }
  } else {
    // nothing to write, nothing to parse, save to close <3
    this.destroy();
  }

  this.writable = false;

  // the parser#destroy emits a `close` event in the nextTick, so we can
  // safely call that before we emit `close` so end event comes before close as
  // required (and done by other Node.js streams)
  this.emit('end');

  return true;
};

/**
 * Expose the stream.
 */
module.exports = Parser;
