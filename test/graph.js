var should = require('should');

var Seed = require('../lib/seed')
  , Graph = Seed.Graph;

function Spy (fn) {
  if (!fn) fn = function() {};

  function proxy() {
    var args = Array.prototype.slice.call(arguments);
    proxy.calls.push(args);
    proxy.called = true;
    fn.apply(this, args);
  }

  proxy.prototype = fn.prototype;
  proxy.calls = [];
  proxy.called = false;

  return proxy;
}

describe('Graph', function () {

  var Person = Seed.Model.extend('person', {});

  it('should have a version', function () {
    should.exist(Seed.version);
  });

  describe('constructor', function () {
    var n = 0
      , graph = Graph.extend({
          initialize: function () {
            n++;
          }
        })
      , g = new graph();

    it('should call initialize', function () {
      n.should.equal(1);
    });

    it('should emit events', function () {
      var spy = Spy();
      g.on('test', spy);
      g.emit('test');
      spy.calls.length.should.equal(1);
    });

    it('should define itself as a graph', function () {
      Graph.toString().should.equal('[object Graph]');
    });
  });

  describe('instance utilities', function () {
    var g = new Graph();

    it('should be able to have arbitrary flags', function () {
      should.not.exist(g.flag('testing'));
      should.not.exist(g.flag('hello'));
      g.flag('testing', true).should.be.ok;
      g.flag('testing').should.be.ok;
      g.flag(['testing','hello'], true);
      g.flag('hello').should.be.ok;
    });
  });

  describe('type definitions', function () {
    var g = new Graph();

    it('should be able to accept a model definition', function () {
      g.define('person', Person);
      g.types.should.contain('person');
    });

    it('should be able to accept a schema instance', function () {
      var s = new Seed.Schema({
        name: String
      });

      g.define('person2', s);
      g.types.should.contain('person2');
    });

    it('should be able to accept a schema definition', function () {
      var s = {
        name: String
      };

      g.define('person3', s);
      g.types.should.contain('person3');
    });

    after(function () {
      describe('list', function () {
        it('should have all types included', function () {
          g.types.length.should.equal(3);
        });
      });
    }); // end after
  });

  describe('adding basic data', function () {
    var g = new Graph()
      , spy = Spy(function (person) {
          should.exist(person);
          person.flag('type').should.equal('person');
      });

    g.define('person', Person);

    var arthur = {
      id: 'arthur',
      name: 'Arthur Dent',
      origin: 'Earth'
    };

    var ford = {
      id: 'ford',
      name: 'Ford Prefect',
      origin: 'Betelgeuse-ish'
    };

    it('should emit `add` events', function () {
      g.on('add:person:*', spy);
    });

    it('should allow data to be set by address', function () {
      g.set('/person/arthur', arthur);
      g.set('/person/ford', ford);
      g.count.should.equal(2);
    });

    after(function () {
      spy.calls.length.should.equal(2);
    });
  });
});