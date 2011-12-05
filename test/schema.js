var should = require('should');

var Seed = require('..')
  , Schema = Seed.Schema;

describe('Schema', function () {

  it('should have a version', function () {
    should.exist(Seed.version);
  });

  describe('required data', function () {
    var s = new Schema({
      name: {
        type: String,
        required: true
      },
      age: Number
    });

    it('should validate when required field included', function () {
      s.validate({ name: 'Seed' }).should.be.ok;
    });

    it('should not validate when required field is missing', function () {
      s.validate({ age: 1 }).should.not.be.ok;
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
        name: {
          first: 'Node',
          last: 'js'
        }};

      s.validate(p).should.be.ok;
    });

    it('should not validate if data for parent not object', function () {
      var p = { name: 'Node.js' };

      s.validate(p).should.not.be.ok;
    });

    it('should not validate when required field is missing', function () {
      var p = {
        name: {
          last: 'js'
        }};

      s.validate(p).should.not.be.ok;
    });
  });
});