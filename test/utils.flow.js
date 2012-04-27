var chai = require('chai')
  , should = chai.should();

var Seed = require('..');

describe('Flow Utils', function () {

  it('should do a series of async calls', function (done) {
    var arr = [ 1, 2, 3, 4, 5, 6 ]
      , count = 0;

    Seed.utils.series(arr, function (num, index, next) {
      index.should.be.equal(num - 1);
      setTimeout(function () {
        count.should.equal(index);
        count++;
        next();
      }, 10);
    }, function () {
      count.should.equal(arr.length);
      done();
    });
  });

  it('should do a parallel of async calls');

  it('should do a concurrent execution of async calls', function (done) {
    var arr = [ 1, 2, 3, 4, 5, 6 ]
      , count = 0;

    Seed.utils.concurrent(arr, 2, function (num, index, next) {
      count++;
      index.should.be.equal(num - 1);
      count.should.be.below(3);
      setTimeout(function () {
        count.should.be.below(3);
        count--;
        next();
      }, 10);
    }, function () {
      count.should.equal(0);
      done();
    });
  });

});
