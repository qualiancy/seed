var Seed = require('../lib/seed');

bench('flag string', function (next) {
  var m = new Seed.Model({ name: 'Hello Universe' });
  m.flag('test', true);
  next();
});

bench('flag array', function (next) {
  var m = new Seed.Model({ name: 'Hello Universe' });
  m.flag([ 'test', 'two', 'three' ], true);
  next();
});