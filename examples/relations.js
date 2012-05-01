var Seed = require('..');

var Person = Seed.Model.extend('person', {
    schema: new Seed.Schema({
        'name': String
    })
});

var People = Seed.Graph.extend({
    initialize: function () {
      this.define(Person);
    }
});

var smith = new Person({
    name: 'The Doctor'
});

var song = new Person({
    name: 'River Song'
});

var pond = new Person({
    name: 'Amy Pond'
});

var williams = new Person({
    name: 'Rory Williams'
});

var tardis = new People();

tardis.set(smith);
tardis.set(song);
tardis.set(pond);
tardis.set(williams);

// make edge from x to y with relation optionally repriocated
// this.relate(x, y, relation, reciprocate);
// read: x is relation to y

tardis.relate(smith, song, 'married');
tardis.relate(song, smith, 'married');

tardis.relate(pond, williams, 'married');
tardis.relate(williams, pond, 'married');

tardis.relate(pond, smith, 'companion');
tardis.relate(williams, pond, 'companion');

tardis._edges.each(function (rel, key) {
  var namex = rel.get('x').get('name')
    , namey = rel.get('y').get('name')
    , relation = rel.get('rel');
  console.log(namex + ' is ' + relation + ' to ' + namey);
});

console.log('');

var trav1 = tardis.traverse();

trav1
  .select(pond)
  .out
  .end(function (err, hash) {
    console.log('Amy\'s has relationships with..');
    hash.each(function (model) {
      console.log(model.get('name'));
    });
  });

console.log('');

var trav2 = tardis.traverse();

trav2
  .select(pond)
  .outE('married')
  .end(function (err, hash) {
    hash.each(function (edge) {
      var x = edge.get('x').get('name')
        , y = edge.get('y').get('name');
      console.log(x + ' is ' + edge.get('rel') + ' to ' + y);
    });
  });

console.log('');

var trav3 = tardis.traverse();

trav3
  .select(smith)
  .in
  .end(function (err, hash) {
    hash.each(function (model) {
      console.log(model.get('name'));
    });
  });

console.log('');

var trav4 = tardis.traverse();

trav4
  .select(smith)
  .inE
  .end(function (err, hash) {
    hash.each(function (edge) {
      var x = edge.get('x').get('name')
        , y = edge.get('y').get('name');
      console.log(x + ' is ' + edge.get('rel') + ' to ' + y);
    });
  });
