var chai = require('chai')
  , should = chai.should();

var Seed = require('..');

describe('Exports', function () {

  it('should have a valid version', function () {
    Seed.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  it('should respond to utility constructors', function () {
    Seed.should.respondTo('Promise');
    Seed.should.respondTo('EventEmitter');
    Seed.should.respondTo('Query');
  });

  it('should respond to main constructors', function () {
    Seed.should.respondTo('Schema');
    Seed.should.respondTo('Hash');
    Seed.should.respondTo('Model');
    Seed.should.respondTo('Graph');
  });

  it('should respond to custom error', function () {
    Seed.should.respondTo('SeedError');
    (function () {
      throw new Seed.SeedError();
    }).should.throw(Seed.SeedError);
    (function () {
      throw new Seed.SeedError('testing');
    }).should.throw(/^testing$/);
  });

  it('should respond to utilities', function () {
    Seed.should.have.property('utils');
    console.log(Seed.utils);
    Seed.utils.should.respondTo('merge');
    Seed.utils.should.respondTo('Flake');
  });

  it('should respond to unique id strategies', function () {
    Seed.should.respondTo('Flake');
    Seed.should.respondTo('Crystal');
    var flake = new Seed.Flake();
    flake.should.respondTo('gen');
    var crystal = new Seed.Crystal();
    crystal.should.respondTo('gen');
  });

  it('should respond to storage', function () {
    Seed.should.respondTo('Store');
    Seed.should.respondTo('MemoryStore');
  });
});
