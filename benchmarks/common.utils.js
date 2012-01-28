var Seed = require('..');

suite('Common Utilities', function () {
  suite('Unique ID Generation', function () {
    var crystal = new Seed.Crystal()
      , flake = new Seed.Flake();

    bench('crystal generate', function () {
      var _id = crystal.gen();
    });

    bench('flake generator', function () {
      var _id = flake.gen();
    });
  });

  suite('Key/Value Flags', function () {
    var m = new Seed.Model({ name: 'Hello Universe' });

    bench('flag string', function () {
      m.flag('test', true);
    });

    bench('flag array', function () {
      m.flag([ 'test', 'two', 'three' ], true);
    });
  });
});
