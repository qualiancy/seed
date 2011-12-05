var should = require('should');

var Seed = require('..')
  , Model = Seed.Model;

describe('Model', function () {
  it('should have a version', function () {
    should.exist(Seed.version);
  });


});
