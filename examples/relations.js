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
    name: 'John Smith'
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

tardis.relate(smith, song, 'married', true);
tardis.relate(pond, williams, 'married', true);

tardis.relate(pond, smith, 'companion');
tardis.relate(williams, pond, 'companion');

tardis._relations.each(function (rel, key) {
  var namex = rel.flag('x').get('name')
    , namey = rel.flag('y').get('name')
    , relation = rel.flag('relation');
  console.log(namex + ' is ' + relation + ' to ' + namey);
  console.log(rel.attributes);
});

