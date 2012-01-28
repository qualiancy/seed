var Seed = require('..');

suite('MemoryStore', function () {
  set('iterations', 50000);
  set('type', 'static');

  var store = new Seed.MemoryStore();
  var Person = Seed.Model.extend({
    store: store
  });

  var arthur = new Person({
      id: 'arthur'
    , name: 'Arthur Dent'
  });

  bench('Set', function (done) {
    arthur.save(done);
  });

  bench('Get', function (done) {
    arthur.fetch(done);
  });
  /* TODO: This performs horribly!
  bench('Save/Destroy', function (done) {
    arthur.save(function () {
      arthur.destroy(done);
    });
  });
  */
});
