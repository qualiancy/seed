var should = require('chai').should();

var Seed = require('..')
  , Filter = Seed.Filter;

describe('Filter', function () {

  it('should have a version', function () {
    Seed.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  it('$gt should work', function () {
    Filter.$gt(1,0).should.be.true;
    Filter.$gt(0,1).should.be.false;
  });

  it('$gte should work', function () {
    Filter.$gte(1,0).should.be.true;
    Filter.$gte(1,1).should.be.true;
    Filter.$gte(0,1).should.be.false;
  });

  it('$lt should work', function () {
    Filter.$lt(0,1).should.be.true;
    Filter.$lt(1,0).should.be.false;
  });

  it('$lte should work', function () {
    Filter.$lte(0,1).should.be.true;
    Filter.$lte(1,1).should.be.true;
    Filter.$lte(1,0).should.be.false;
  });

  it('$all should work', function () {
    Filter.$all([1,2],[1,2]).should.be.true;
    Filter.$all([1], [1,2]).should.be.false;
    Filter.$all([1,2,3],[1,2]).should.be.true;
  });

  it('$exists should work', function () {
    var a = undefined
      , b = {c: 'hi'};
    Filter.$exists(a, false).should.be.true;
    Filter.$exists(b, true).should.be.true;
    Filter.$exists(b.c, false).should.be.false;
    Filter.$exists(b.a, false).should.be.true;
    Filter.$exists('hi', true).should.be.true;
  });

});
