describe('Exports', function () {

  it('should have a valid version', function () {
    seed.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  it('should respond to utility constructors', function () {
    seed.should.respondTo('Promise');
    seed.should.respondTo('EventEmitter');
    seed.should.respondTo('Query');
  });

  it('should respond to main constructors', function () {
    seed.should.respondTo('Schema');
    seed.should.respondTo('Hash');
    seed.should.respondTo('Model');
    seed.should.respondTo('Graph');
  });

  it('should respond to utilities', function () {
    seed.should.have.property('utils');
    seed.utils.should.respondTo('merge');
    seed.utils.should.respondTo('Flake');
  });

  it('should respond to unique id strategies', function () {
    seed.should.respondTo('Flake');
    seed.should.respondTo('Crystal');
    var flake = new seed.Flake();
    flake.should.respondTo('gen');
    var crystal = new seed.Crystal();
    crystal.should.respondTo('gen');
  });

  it('should respond to storage', function () {
    seed.should.respondTo('Store');
    seed.should.respondTo('MemoryStore');
  });

});
