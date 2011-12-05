var matcha = require('matcha')
  , Seed = require('../lib/seed')
  , ObjectId = new Seed.ObjectId();

var suite = new matcha.Suite({
  iterations: 10000,
});

suite.bench('generate', function (next) {
  var _id = ObjectId.gen();
  next();
});

module.exports = suite;