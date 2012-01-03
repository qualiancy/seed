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
    Filter.$exists(a, true).should.be.false;
    Filter.$exists(b, true).should.be.true;
    Filter.$exists(b.c, false).should.be.false;
    Filter.$exists(b.a, false).should.be.true;
    Filter.$exists('hi', true).should.be.true;
  });

  it('$mod should work', function () {
    Filter.$mod(12, [12, 0]).should.be.true;
    Filter.$mod(24, [12, 0]).should.be.true;
    Filter.$mod(15, [12, 0]).should.be.false;
  });

  it('$ne should work', function () {
    Filter.$ne(12,12).should.be.false;
    Filter.$ne(12,11).should.be.true;
  });

  it('$in should work', function () {
    Filter.$in(1,[0,1,2]).should.be.true;
    Filter.$in(4,[0,1,2]).should.be.false;
  });

  it('$nin should work', function () {
    Filter.$nin(1,[0,1,2]).should.be.false;
    Filter.$nin(4,[0,1,2]).should.be.true;
  });

  it('$size should work', function () {
    Filter.$size([0,1,2], 3).should.be.true;
    Filter.$size('foo', 3).should.be.true;
    Filter.$size({ a: 1}, 1).should.be.false;
    Filter.$size({ length: 3}, 3).should.be.true;
  });

  it('$or should work', function () {
    var a = [0,1,2]
      , t1 = Filter.$size(a, 2) // fail
      , t2 = Filter.$in(1, a) // pass
      , t3 = Filter.$in(4, a); // fail
    Filter.$or([ t1, t2 ]).should.be.true;
    Filter.$or([ t1, t3 ]).should.be.false;
  });
});
