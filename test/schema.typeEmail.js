var should = require('chai').should();

var Seed = require('..')
  , Schema = Seed.Schema;

describe('Schema Type', function () {

  it('should have a version', function () {
    should.exist(Seed.version);
  });

  describe('Email', function () {
    var s = new Schema({
      email: Schema.Type.Email
    });

    it('should validate with a proper email', function () {
      s.validate({ email: 'jake@alogicalparadox.com' }).should.be.ok;
    });

    it('should not validate with a bad email', function () {
      s.validate({ email: '@jakeluer' }).should.not.be.ok;
      s.validate({ email: 'hello world' }).should.not.be.ok;
    });
  });

});