var Seed = require('..');

suite('Hash', function () {
  set('iterations', 100);

  var hash = new Seed.Hash();

  var seti = 0;
  bench('#set', function () {
    hash.set(++seti, 'hello', true);
  });

  var geti = 0;
  bench('#get', function () {
    var val = hash.get(++geti);
  });

  var deli = 0;
  bench('#del', function () {
    hash.del(++deli, true);
  });

});
