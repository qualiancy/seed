var should = require('chai').should();

var Seed = require('..')
  , Schema = Seed.Schema
  , Model = Seed.Model;

describe('Schema Type', function () {

  describe('DBRef', function () {
    var Address = Model.extend('address')
      , PersonSchema = new Schema({
            name: String
          , address: {
                type: Schema.Type.DBRef
              , model: Address
            }
        });

    it('should have the proper definition', function () {
      PersonSchema.paths.should.have.length(2);
      PersonSchema.paths.keys.should.include('name', 'address');

      PersonSchema.paths.get('address')
        .should.have.property('type')
          .to.eql(Schema.Type.DBRef);
      PersonSchema.paths.get('address')
        .should.have.property('model')
          .to.be.eql(Address);
    });

    it('should validate with the proper values', function () {
      var address = new Address({ _id: 123, zip: 12345 });

      PersonSchema.validate({
          name: 'John Smith'
        , address: address
      }).should.be.true;

      PersonSchema.validate({
          name: 'John Smith'
        , address: {
              $ref: 'address'
            , $id: 123
          }
      }).should.be.true;
    });

    it('should not validate with improper values', function () {
      var address = new Model({ zip: 12345 });

      PersonSchema.validate({
          name: 'John Smith'
        , address: address
      }).should.be.false;

      PersonSchema.validate({
          name: 'John Smith'
        , address: {}
      }).should.be.false;

      PersonSchema.validate({
          name: 'John Smith'
        , address: {
              $ref: 'address'
          }
      }).should.be.false;

      PersonSchema.validate({
          name: 'John Smith'
        , address: {
              $ref: 'person'
            , $id: 123
          }
      }).should.be.false;
    });
  });
});
