var should = require('chai').should();

var Seed = require('..')
  , MemoryStore = Seed.MemoryStore;

describe('MemoryStore', function () {
  it('should have a version', function () {
    Seed.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  describe('constructor', function () {

    it('should call initialize', function () {
      var Store = new MemoryStore();
      Store.store.should.be.a('object');
    });

  });

  describe('CRUD from Model', function () {

    // store uses hash so we can compare expectations.
    var store = new MemoryStore();

    var Person = Seed.Model.extend('person', {
        store: store
    });

    var arthur = new Person({
        id: 'arthur'
      , name: 'Arthur Dent'
    });

    it('should allow a new object to be created', function (done) {
      arthur.save(function (err) {
        should.not.exist(err);
        store.store.person.length.should.equal(1);
        arthur._attributes.should.eql(store.store.person.get('arthur'));
        done();
      });
    });

    it('should allow an already written object to be retrieved', function (done) {
      var dent = new Person({
          id: 'arthur'
      });

      dent.fetch(function (err) {
        should.not.exist(err);
        dent._attributes.should.eql(arthur._attributes);
        done();
      })
    });

    it('should allow an already written object to be modified', function (done) {

      arthur.set({ 'location': 'earth' });
      arthur.save(function (err) {
        should.not.exist(err);

        var confirm = new Person({
            id: 'arthur'
        });

        confirm.fetch(function (err) {
          should.not.exist(err);
          confirm._attributes.should.eql({
              id: 'arthur'
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
            id: 'arthur'
        });

        confirm.fetch(function (err) {
          should.exist(err);
          err.code.should.equal(3);
          done();
        });
      });
    });
  });


  describe('CRUD from Graph', function () {

    it('should allow new objects to be created', function (done) {
      done();
    });

    it('should allow already existing objects to be read', function (done) {
      done();
    });

    it('should allow a subset of existing objects to be selected', function (done) {
      done();
    });

    it('show allow an already existing object to be updated', function (done) {
      done();
    })

    it('should allow an already existing ojbect tobe deleted', function (done) {
      done();
    });

  });

});
