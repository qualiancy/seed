var should = require('should');

var Seed = require('..')
  , Schema = Seed.Schema;

describe('Schema Type', function () {

  it('should have a version', function () {
    should.exist(Seed.version);
  });

  describe('Select', function () {
    var states = ['AL','AK','AZ','AR','CA','CO','CT','DE',
      'FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI',
      'MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK',
      'OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY' ];

    var s = new Schema({
      state: {
        type: Schema.Type.Select,
        allowed: states
      }
    });

    it('should validate with a state', function () {
      s.validate({ state: 'CA' }).should.be.ok;
    });

    it('should not validate with a non-included value', function () {
      s.validate({ state: 'UK' }).should.not.be.ok;
    });
  });

});