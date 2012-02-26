var Seed = require('..');

suite('MemoryStore', function () {
  set('iterations', 50000);
  set('type', 'static');

  var store = new Seed.MemoryStore();
  var Person = Seed.Model.extend({
    store: store
  });

  var iset = 0;
  bench('Set', function (done) {
    var m = new Person({ _id: ++iset });
    m.save(done);
  });

  var iget = 0;
  bench('Get', function (done) {
    var m = new Person({ _id: ++iget });
    m.fetch(done);
  });

  var idel = 0;
  bench('Save/Destroy', function (done) {
    var m = new Person({ _id: ++idel });
    m.destroy(done);
  });
});
