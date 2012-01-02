var should = require('chai').should();

var Seed = require('..')
  , Schema = Seed.Schema;

describe('Schema Type', function () {

  it('should have a version', function () {
    should.exist(Seed.version);
  });

  describe('Number', function () {
    var s = new Schema({
      num: Number
    });

    it('should validate with a number', function () {
      s.validate({ num: 10 }).should.be.ok;
    });

    it('should not validate with other types', function () {
      s.validate({ num: 'hello' }).should.not.be.ok;
      s.validate({ num: [  ] }).should.not.be.ok;
    });
  });

  describe('String', function () {
    var s = new Schema({
      str: String
    });

    it('should validate with a string', function () {
      s.validate({ str: 'hello' }).should.be.ok;
    });

    it('should not validate with other types', function () {
      s.validate({ str: 1 }).should.not.be.ok;
      s.validate({ str: [ 'hello' ] }).should.not.be.ok;
    });
  });

  describe('Array', function () {
    var s = new Schema({
      arr: Array
    });

    it('should validate with a array', function () {
      s.validate({ arr: [ 'hello', 1 ] }).should.be.ok;
    });

    it('should not validate with other types', function () {
      s.validate({ arr: 1 }).should.not.be.ok;
      s.validate({ arr: 'hello' }).should.not.be.ok;
    });
  });

});