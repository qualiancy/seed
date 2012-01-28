var should = require('chai').should();

var Seed = require('..')
  , Model = Seed.Model;

describe('Model', function () {
  it('should have a version', function () {
    Seed.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  describe('managing attributes', function () {
    var model = new Seed.Model();
    it('should allow for attributes to be `set`', function () {
      model.set({ hello: 'universe' });
      model._attributes.hello.should.equal('universe');
    });

    it('should allow for attributed to be `get`', function () {
      model.get('hello').should.equal('universe');
    });
  });
});
