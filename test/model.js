var should = require('chai').should();

var Seed = require('..')
  , Model = Seed.Model;

describe('Model', function () {
  it('should have a version', function () {
    Seed.version.should.match(/^\d+\.\d+\.\d+$/);
  });


});
