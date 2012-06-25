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

    it('should know what fields are required', function () {
      s.required.should.have.length(1);
      s.required.has('name').should.be.true;
      s.required.has('age').should.be.false;
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

    it('should know what fields are required', function () {
      s.required.should.have.length(1);
      s.required.has('name.first').should.be.true;
      s.required.has('name').should.be.false;
      s.required.has('name.last').should.be.false;
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
      s.validatePath('name.first', 'Node').should.be.true;
      s.validatePath('name.first', 12).should.be.false;
      s.validatePath('name.first', undefined).should.be.false;
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
      , location: {
            type: Schema.Type.Geospatial
          , index: '2d'
        }
    });

    it('should recognize the index', function () {
      s.indexes.should.have.length(2);
      s.indexes.keys.should.include('_id', 'location');
    });

    it('should validate if an index is provided', function () {
      s.validate({ _id: 'hello'}).should.be.true
    });

    it('should not validate if the wrong type of index is provided', function() {
      s.validate({ _id: 42 }).should.be.false;
    });
  });

  describe('model integration', function () {

    it('can be set to a model', function () {
      var m = new Seed.Model()
        , s = new Schema();
      s.indexes.should.have.length(0);
      m.schema = s;
      m.schema.should.deep.equal(s);
      s.indexes.should.have.length(1);
    });

    it('can validate a models data', function () {
      var s = new Schema({ name: { type: String, required: true }})
        , M = Seed.Model.extend('test', { schema: s })
        , m = new M({ name: 1234 });
      m.get('name').should.equal(1234);
      m.validate().should.be.false;
      var notvalid = m.set('name', 1111);
      notvalid.should.be.false;
      m.get('name').should.equal(1234);
      var valid = m.set('name', 'Arthur Dent');
      valid.should.be.true;
      m.get('name').should.equal('Arthur Dent');
    });

  });
});
