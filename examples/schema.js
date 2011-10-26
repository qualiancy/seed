var Seed = require('..')
  , Type = Seed.Schema.Type;

var States = new Type.Select(['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI',
'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO',
'MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']);

var Person = new Seed.Schema({
  name: {
    type: String,
    require: true
  },
  age: {
    type: Number,
    require: true
  },
  skills: Array,
  address: {
    street: String,
    city: String,
    state: States,
    zipcode: Number
  }
});

var traveller_1 = {
  name: 'Jim Doe',
  age: 26,
  skills: ['nodejs', 'javascript'],
  address: {
    street: 'Somewhere',
    city: 'San Francisco',
    state: 'CA',
    zipcode: 94106
  }
};

var traveller_2 = {
  name: 'Jim Doe',
  skills: 'nodejs',
  address: {
    street: 'Somewhere',
    city: 'London',
    state: 'UK'
  }
};

var valid_person = Person.validate(traveller_1);
var invalid_person = Person.validate(traveller_2);
  
console.log(traveller_1.name + ' valid: ' + valid_person);
console.log(traveller_2.name + ' valid: ' + invalid_person);
