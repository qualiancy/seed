var should = require('chai').should();

var Seed = require('..')
  , MemoryStore = Seed.MemoryStore;

describe('MemoryStore', function () {
  it('should have a version', function () {
    Seed.version.should.match(/^\d+\.\d+\.\d+$/);
  });

});
