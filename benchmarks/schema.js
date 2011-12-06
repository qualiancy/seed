var Seed = require('../lib/seed');

var schema = new Seed.Schema({
  string: String,
  number: Number,
  array: Array,
  nested: {
    string: String
  }
});

var model = Seed.Model.extend({
  schema: schema
});

var data = {
  string: 'hello seed',
  number: 123456789,
  array: [ 4, [], {}, 'seed' ],
  nested: {
    string: 'hello universe'
  }
}

bench('Schema#validate', function (next) {
  var valid = schema.validate(data);
  next();
});

bench('Model#constructor', function (next) {
  var m = new model(data);
  next();
});