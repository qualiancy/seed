var should = require('chai').should();

var Seed = require('..')
  , Schema = Seed.Schema;

describe('Schema Type', function () {

  describe('Geospatial', function () {
    var s = new Schema({
      location: Schema.Type.Geospatial
    });

    it('should validate with an array', function () {
      s.validate({ location: [ 40, 40 ] }).should.be.true;
      s.validate({ location: [ 40, 40, 40 ] }).should.be.true;
    });

    it('should not validate with an improper array', function () {
      s.validate({ location: [ 40 ] }).should.be.false;
      // s.validate({ location: [ 40, 40, 40, 40 ] }).should.be.false;
    });

    it('should validate with an object', function () {
      s.validate({ location: { x: 40, y: 40 } }).should.be.true;
      s.validate({ location: { x: 40, y: 40, z: 40 } }).should.be.true;
      s.validate({ location: { lon: 40, lat: 40 } }).should.be.true;
      s.validate({ location: { lon: 40, lat: 40 , alt: 40 } }).should.be.true;
    });

    it('should not validate with an improper object', function () {
      s.validate({ location: { } }).should.be.false;
      s.validate({ location: { x: 40 } }).should.be.false;
      s.validate({ location: { y: 40 } }).should.be.false;
      s.validate({ location: { lon: 40 } }).should.be.false;
      s.validate({ location: { lat: 40 } }).should.be.false;
    });

  });

});
