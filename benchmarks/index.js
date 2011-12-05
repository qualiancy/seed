var aura = require('matcha')
  , suite = new aura.Suite({
      iterations: 10000,
    });

var Seed = require('../lib/seed')
  , Schema = Seed.Schema
  , Model = Seed.Model;

var schema = new Schema({
  string: String,
  number: Number,
  array: Array,
  nested: {
    string: String
  }
});

var data = {
  string: 'hello seed',
  number: 123456789,
  array: [ 4, [], {}, 'seed' ],
  nested: {
    string: 'hello universe'
  }
}

var doc = Model.extend('doc', {
  schema: schema
});

suite.bench('Schema#validate', function (next) {
  var valid = schema.validate(data);
  next();
});

suite.bench('new Model()', function (next) {
  var s = new doc(data);
  s.flag('bench', true);
  next();
});



suite.run();