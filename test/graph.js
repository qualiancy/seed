var chai = require('chai')
  , chaispies = require('chai-spies')
  , should = chai.should();

chai.use(chaispies);

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
      _id: 'arthur'
    , name: 'Arthur Dent'
    , stats: {
          origin: 'Earth'
        , occupation: 'traveller'
        , species: 'human'
      }
  };

  var ford = {
      _id: 'ford'
    , name: 'Ford Prefect'
    , stats: {
          origin: 'Betelgeuse-ish'
        , occupation: 'traveller'
        , species: 'writer'
      }
  };

  var earth = {
      _id: 'earth'
    , name: 'Dent\'s Planet Earth'
  };

  var ship = {
      _id: 'gold'
    , name: 'Starship Heart of Gold'
  };

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
      var spy = chai.spy(function (v) {
        v.should.be.ok;
      });

      should.not.exist(g.flag('testing'));
      should.not.exist(g.flag('hello'));

      g.on([ 'flag', 'testing' ], spy);

      g.flag('testing', true).should.be.ok;
      g.flag('testing').should.be.ok;
      g.flag(['testing','hello'], true);
      g.flag('hello').should.be.ok;

      spy.should.have.been.called.twice;
    });

    it('should know its types', function () {
      g.define('person', { _id: String });
      g.types.should.include('person');
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
      g.set('person', arthur._id, arthur);
      g.set('person', ford._id, ford);
      g.length.should.equal(2);
    });

    it('should have called all callbacks', function () {
      spy.calls.length.should.equal(2);
    });
  });

  describe('filter/find', function () {
    var g = new Graph();

    g.define('person', Person);
    g.define('location', Location);

    g.set('person', arthur._id, arthur);
    g.set('person', ford._id, ford);
    g.set('location', earth._id, earth);
    g.set('location', ship._id, ship);

    it('should provide a hash when find by attr', function () {
      var res = g.find({ 'name' : { $eq: 'Arthur Dent' } });
      res.should.have.length(1);
      res.should.be.instanceof(Seed.Hash);
    });

    it('should allow for filter by type', function () {
      var res = g.filter('person');
      res.should.have.length(2);
      res.should.be.instanceof(Seed.Hash);
    });

    it('should allow for filter by iterator', function () {
      var res = g.filter(function (m) {
        return m.get('stats.occupation') == 'traveller';
      });
      res.should.have.length(2);
      res.should.be.instanceof(Seed.Hash);
    });

    it('should allow for filter by type + iterator', function () {
      var res = g.filter('person', function (m) {
        return m.id == 'arthur';
      });
      res.should.have.length(1);
      res.should.be.instanceof(Seed.Hash);
    });

    it('should returned undefined for bad formed filter', function () {
      var res = g.filter();
      should.not.exist(res);
    });

    it('should allow for filter then find', function () {
      var res = g.filter('person').find({ 'name': { $eq: 'Arthur Dent' }});
      res.should.have.length(1);
      res.should.be.instanceof(Seed.Hash);
    });

    it('should allow for filters by nested attribute', function () {
      var res = g.find({ 'stats.species' : { $eq: 'human' } });
      res.should.have.length(1);
      res.should.be.instanceof(Seed.Hash);
    });

  });

  describe('iteration', function () {
    var g = new Graph();

    g.define('person', Person);
    g.define('location', Location);

    g.set('person', arthur._id, arthur);
    g.set('person', ford._id, ford);
    g.set('location', earth._id, earth);
    g.set('location', ship._id, ship);

    it('should allow for iteration through all objects', function () {
      var i = 0;
      g.each(function (m) {
        i++;
      });
      i.should.equal(4);
    });

    it('should allow for iteration through specific types', function () {
      var i = 0;
      g.each('person', function (m) {
        i++;
      });
      i.should.equal(2);
    });
  });

  describe('flush', function () {

    var g = new Graph();

    g.define('person', Person);
    g.define('location', Location);

    beforeEach(function () {
      g.set('person', arthur._id, arthur);
      g.set('person', ford._id, ford);
      g.set('location', earth._id, earth);
      g.set('location', ship._id, ship);
    });

    it('should allow flushing', function () {
      var spy = Spy();
      g.should.have.length(4);
      g.on([ 'flush', 'all' ], spy);
      g.flush();
      g.should.have.length(0);
      spy.calls.length.should.equal(1);
    });

    it('should allow flushing by type', function () {
      var spy = Spy();
      g.should.have.length(4);
      g.on([ 'flush', 'person'], spy);
      g.flush('person');
      g.should.have.length(2);
      spy.calls.length.should.equal(1);
    });

  });
});
