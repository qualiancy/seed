var should = require('chai').should();

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

  var Person = Seed.Model.extend('person', {})
    , Location = Seed.Model.extend('location', {});

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

  var earth = {
      id: 'earth'
    , name: 'Dent\'s Planet Earth'
  };

  var ship = {
      id: 'gold'
    , name: 'Starship Heart of Gold'
  };

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
      g.types.should.include('person');
    });

    it('should be able to accept a schema instance', function () {
      var s = new Seed.Schema({
        name: String
      });

      g.define('person2', s);
      g.types.should.include('person2');
    });

    it('should be able to accept a schema definition', function () {
      var s = {
        name: String
      };

      g.define('person3', s);
      g.types.should.include('person3');
    });

    it('should have all types included', function () {
      g.types.length.should.equal(3);
    });
  });

  describe('adding basic data', function () {
    var g = new Graph()
      , spy = Spy(function (person) {
          should.exist(person);
          person.flag('type').should.equal('person');
      });

    g.define('person', Person);

    it('should emit `add` events', function () {
      g.on('add:person:*', spy);
    });

    it('should allow data to be set by address', function () {
      g.set('/person/' + arthur.id, arthur);
      g.set('/person/' + ford.id, ford);
      g.count.should.equal(2);
    });

    it('should have called all callbacks', function () {
      spy.calls.length.should.equal(2);
    });
  });

  describe('select', function () {
    var g = new Graph();

    g.define('person', Person);
    g.define('location', Location);

    g.set('/person/' + arthur.id, arthur);
    g.set('/person/' + ford.id, ford);
    g.set('/location/' + earth.id, earth);
    g.set('/location/' + ship.id, ship);

    it('should provide a hash when select by attr', function () {
      var locations = g.select({ name: 'Starship Heart of Gold' });

      locations.should.be.instanceof(Seed.Hash);
      locations.length.should.equal(1);
    });

    it('should allow select by regex', function () {
      var people = g.select({ name: /Dent$/});

      people.should.be.instanceof(Seed.Hash);
      people.length.should.equal(1);
    });

  });

  describe('flushing the graph', function () {



  });
});