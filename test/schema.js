var should = require('should');

var Seed = require('..')
  , Schema = Seed.Schema;

describe('Schema', function () {

  it('should have a version', function () {
    should.exist(Seed.version);
  });

});