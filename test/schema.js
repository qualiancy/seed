var should = require('chai').should();

var Seed = require('..')
  , Schema = Seed.Schema;

describe('Schema', function () {

  describe('required data', function () {
    var s = new Schema({
      name: {
        type: String,
        required: true
      },
      age: Number
    });

    it('should validate when required field included', function () {
      s.validate({ _id: 'test', name: 'Seed' }).should.be.ok;
    });

    it('should not validate when required field is missing', function () {
      s.validate({ _id: 'test', age: 1 }).should.not.be.ok;
    });
  });

  describe('nested data', function () {
    var s = new Schema({
      name: {
        first: {
          type: String,
          required: true
        },
        last: String
      }
    });

    it('should validate when required fields included', function () {
      var p = {
        _id: 'test'
        , name: {
            first: 'Node',
            last: 'js'
          }
        };

      s.validate(p).should.be.ok;
    });

    it('should not validate if data for parent not object', function () {
      var p = { _id: 'test', name: 'Node.js' };

      s.validate(p).should.not.be.ok;
    });

    it('should not validate when required field is missing', function () {
      var p = {
          _id: 'test'
        , name: {
            last: 'js'
          }
      };

      s.validate(p).should.not.be.ok;
    });
  });

  describe('indexes', function () {
    var s = new Schema({
        _id: {
            type: String
          , index: true
        }
      , name: String
    });

    it('should recognize the index', function () {
      s.indexes.has('_id').should.be.true;
    });

    it('should validate if an index is provided', function () {
      s.validate({ _id: 'hello'}).should.be.true
    });

    it('should not validate if the wrong type of index is provided', function() {
      s.validate({ _id: 42 }).should.be.false;
    });

  });
});
