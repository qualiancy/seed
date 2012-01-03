var should = require('chai').should();

var Seed = require('..')
  , Filter = Seed.Filter;

describe('Model', function () {
  it('should have a version', function () {
    Seed.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  it('should parse a single query', function () {
    var query = { $lt: 10 }
      , F = new Filter(query);
    F.stack.should.have.length(1);
    F.test(8).should.be.true;
    F.test(11).should.be.false;
  });

  it('should parse a lengthed query', function () {
    var query = { $lt: 10, $gt: 5 }
      , F = new Filter(query);
    F.stack.should.have.length(2);
    F.test(8).should.be.true;
    F.test(4).should.be.false;
    F.test(11).should.be.false;
  });

  it('should parse a nested query', function () {
    var query = { $and: [ { $size: 3 }, { $all: [ 1, 2 ] } ] }
      , F = new Filter(query);
    F.stack.should.have.length(1);
    F.stack[0].params.should.be.instanceof(Array);
    F.test([0,1,2]).should.be.true;
  });

  // TODO: More complicated nesting
  // TODO: All nesting options.

});
