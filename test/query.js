var should = require('chai').should();

var Seed = require('..')
  , Query = Seed.Query;

describe('Model', function () {
  it('should have a version', function () {
    Seed.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  it('should parse a single query', function () {
    var query = { $lt: 10 }
      , Q = new Query(query);
    Q.stack.should.have.length(1);
    Q.test(8).should.be.true;
    Q.test(11).should.be.false;
  });

  it('should parse a lengthed query', function () {
    var query = { $lt: 10, $gt: 5 }
      , Q = new Query(query);
    Q.stack.should.have.length(2);
    Q.test(8).should.be.true;
    Q.test(4).should.be.false;
    Q.test(11).should.be.false;
  });

  it('should parse a nested query', function () {
    var query = { $and: [ { $size: 3 }, { $all: [ 1, 2 ] } ] }
      , Q = new Query(query);
    Q.test([0,1,2]).should.be.true;
  });

});
