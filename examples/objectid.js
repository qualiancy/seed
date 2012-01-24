var Seed = require('..')

console.log('\nFLAKE');
var Flake = new Seed.Flake()
for (var i = 0; i < 10; i ++) {
  var id = Flake.gen();
  console.log(id);
}

console.log('\nCRYSTAL');
var Crystal = new Seed.Crystal();
for (var i = 0; i < 10; i++) {
  var id = Crystal.gen();
  console.log(id);
}

console.log('\nCRYSTAL SHORT');
var ShortCrystal = new Seed.Crystal({ bits: 16, base: 36 });
for (var i = 0; i < 10; i++) {
  var id = ShortCrystal.gen();
  console.log(id);
}

console.log('');
