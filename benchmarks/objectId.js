var Seed = require('../lib/seed')
  , ObjectId = new Seed.ObjectId();

bench('generate', function (next) {
  var _id = ObjectId.gen();
  next();
});