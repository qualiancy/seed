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
      Store.store.should.be.an.instanceof(Seed.Hash);
    });

  });

  describe('CRUD from Model', function () {

    var Person = Seed.Model.extend('person', {
        store: new MemoryStore()
    });

    it('should allow a new object to be created', function (done) {
      done();
    });

  });

});
