var should = require('chai').should();

var Seed = require('..')
  , MemoryStore = Seed.MemoryStore;

describe('MemoryStore', function () {

  describe('constructor', function () {

    it('should call initialize', function () {
      var Store = new MemoryStore();
      Store.should.have.property('store').a('object');
    });

  });

  describe('CRUD from Model', function () {

    // store uses hash so we can compare expectations.
    var store = new MemoryStore();

    var Person = Seed.Model.extend('person', {
        store: store
    });

    var arthur = new Person({
        _id: 'arthur'
      , name: 'Arthur Dent'
    });

    it('should allow a new object to be created', function (done) {
      arthur.save(function (err) {
        should.not.exist(err);
        store.store.person.should.have.length(1);
        arthur._attributes.should.eql(store.store.person.get('arthur'));
        done();
      });
    });

    it('should allow an already written object to be retrieved', function (done) {
      var dent = new Person({
        _id: 'arthur'
      });

      dent.fetch(function (err) {
        should.not.exist(err);
        dent._attributes.should.eql(arthur._attributes);
        done();
      })
    });

    it('should allow an already written object to be modified', function (done) {

      arthur.set('location', 'earth');
      arthur.save(function (err) {
        should.not.exist(err);

        var confirm = new Person({
            _id: 'arthur'
        });

        confirm.fetch(function (err) {
          should.not.exist(err);
          confirm._attributes.should.eql({
              _id: 'arthur'
            , name: 'Arthur Dent'
            , location: 'earth'
          });
          done();
        });
      });
    });

    it('should allow an already existing item to be removed', function (done) {

      arthur.destroy(function (err) {
        should.not.exist(err);

        var confirm = new Person({
            _id: 'arthur'
        });

        confirm.fetch(function (err) {
          should.exist(err);
          err.should.be.instanceof(Seed.errors.store._proto);
          done();
        });
      });
    });
  });


  describe('CRUD from Graph', function () {
    var store = new MemoryStore()
      , graph = new Seed.Graph({
          store: store
        });

    var Person = Seed.Model.extend('person', {})
      , Location = Seed.Model.extend('location', {});

    graph.define(Person);
    graph.define(Location);

    var arthur = {
        _id: 'arthur'
      , name: 'Arthur Dent'
      , stats: {
            origin: 'Earth'
          , species: 'human'
        }
    };

    var ford = {
        _id: 'ford'
      , name: 'Ford Prefect'
      , stats: {
            origin: 'Betelgeuse-ish'
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

    beforeEach(function () {
      graph.flush();
    });

    it('should allow new objects to be created', function (done) {
      graph.set('person', arthur._id, arthur);
      graph.set('person', ford._id, ford);
      graph.set('location', earth._id, earth);
      graph.set('location', ship._id, ship);

      graph.push(function (err) {
        should.not.exist(err);
        store.store.person.should.be.instanceof(Seed.Hash);
        store.store.location.should.be.instanceof(Seed.Hash);
        store.store.person.should.have.length(2);
        store.store.location.should.have.length(2);
        done();
      });

    });

    it('should allow already existing objects to be read', function (done) {
      graph.set('person', arthur._id);
      graph.set('person', ford._id);
      graph.set('location', earth._id);
      graph.set('location', ship._id);

      graph.pull({ force: true }, function (err) {
        should.not.exist(err);
        graph.should.have.length(4);

        var arthur2 = graph.get('person', 'arthur');
        arthur2._attributes.should.eql(arthur);
        arthur2.flag('dirty').should.be.false;
        done();
      });
    });

    it('should allow all records of a specific type to be fetched', function (done) {
      graph.fetch('person', function (err) {
        should.not.exist(err);
        graph.should.have.length(2);

        var arthur2 = graph.get('person' ,'arthur');
        arthur2._attributes.should.eql(arthur);
        arthur2.flag('dirty').should.be.false;
        done();
      });
    });

    it('should allow a subset of existing objects to be selected', function (done) {
      graph.fetch('person', { 'name': { $eq: 'Arthur Dent' } }, function (err) {
        should.not.exist(err);
        graph.should.have.length(1);

        var arthur2 = graph.get('person', 'arthur');
        arthur2._attributes.should.eql(arthur);
        arthur2.flag('dirty').should.be.false;
        done();
      });
    });

    it('show allow an already existing object to be updated', function (done) {
      graph.fetch('person', function (err) {
        should.not.exist(err);
        graph.should.have.length(2);

        var arthur2 = graph.get('person', 'arthur');
        arthur2._attributes.should.eql(arthur);
        arthur2.flag('dirty').should.be.false;
        arthur2.set('name', 'The Traveler');
        arthur2.flag('dirty').should.be.true;

        graph.push(function (err) {
          should.not.exist(err);
          store.store.person.get('arthur').should.have.property('name', 'The Traveler');
          done();
        });
      });
    })

    it('should allow an already existing object to be deleted', function (done) {
      // deletion is handled through the model interface. this is not currently needed.
      // perhaps in time, if mass deletion of purging is required.
      done();
    });

  });

});
