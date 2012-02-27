var should = require('chai').should();

var Seed = require('..')
  , Schema = Seed.Schema;

describe('Schema Type', function () {

  describe('Number', function () {
    var s = new Schema({
      num: Number
    });

    it('should validate with a number', function () {
      s.validate({ _id: 'test', num: 10 }).should.be.ok;
    });

    it('should not validate with other types', function () {
      s.validate({ _id: 'test', num: 'hello' }).should.not.be.ok;
      s.validate({ _id: 'test', num: [  ] }).should.not.be.ok;
    });
  });

  describe('String', function () {
    var s = new Schema({
      str: String
    });

    it('should validate with a string', function () {
      s.validate({ _id: 'test', str: 'hello' }).should.be.ok;
    });

    it('should not validate with other types', function () {
      s.validate({ _id: 'test', str: 1 }).should.not.be.ok;
      s.validate({ _id: 'test', str: [ 'hello' ] }).should.not.be.ok;
    });
  });

  describe('Array', function () {
    var s = new Schema({
      arr: Array
    });

    it('should validate with a array', function () {
      s.validate({ _id: 'test', arr: [ 'hello', 1 ] }).should.be.ok;
    });

    it('should not validate with other types', function () {
      s.validate({ _id: 'test', arr: 1 }).should.not.be.ok;
      s.validate({ _id: 'test', arr: 'hello' }).should.not.be.ok;
    });
  });

});
