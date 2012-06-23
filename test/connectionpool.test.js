/*globals expect, TESTNUMBER, net */
describe('connectionpool', function () {
  'use strict';

  var ConnectionPool = require('../lib/connectionpool')
    , port = TESTNUMBER
    , host = 'localhost'
    , server;

  before(function before(done) {
    server = net.createServer(function create(socket) {
      socket.write('<3');
    });

    server.listen(port, host, done);
  });

  it('should exported as a function', function () {
    expect(ConnectionPool).to.be.a('function');
  });

  it('should be an instance of EventEmitter', function () {
    expect(new ConnectionPool).to.be.instanceof(process.EventEmitter);
  });

  describe('initialize', function () {
    it('should update the limit if its supplied', function () {
      var pool = new ConnectionPool(100);

      expect(pool.limit).to.eql(100);
    });

    it('should also update the generator if its supplied', function () {
      function test() {}
      var pool = new ConnectionPool(100, test);

      expect(pool.generator).to.eql(test);
    });
  });

  describe('#factory', function () {
    it('should throw an error if the supplied factory is not a function', function () {
      var pool = new ConnectionPool();

      expect(pool.factory).to.throw(Error);
    });

    it('should not throw an error if a function is supplied', function () {
      var pool = new ConnectionPool();

      function test() {}
      expect(pool.factory.bind(pool, test)).to.not.throw(Error);
    });
  });

  describe('#allocate', function () {
    it('should give an error when no #factory is specified', function (done) {
      var pool = new ConnectionPool();

      pool.allocate(function allocate(err, conn) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.contain('#factory');

        done();
      });
    });

    it('should emit an error when we cannot establish a connection', function (done) {
      var pool = new ConnectionPool()
        , differentport = TESTNUMBER;

      pool.once('error', function error(err) {
        expect(err).to.be.an.instanceof(Error);
      });

      pool.factory(function factory() {
        return net.connect(differentport, host);
      });

      // make sure the port is different
      expect(differentport).to.not.eql(port);

      pool.allocate(function allocate(err, connection) {
        expect(err).to.be.an.instanceof(Error);

        done();
      });
    });
  });

  after(function after(done) {
    // in 0.7, we can supply the server with the done callback
    server.once('close', done);
    server.close();
  });
});
