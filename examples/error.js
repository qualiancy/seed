var CustomError = require('..').SeedError;

function log (err) {
  console.error(err);
}

function a (){
  b();
}

function b () {
  var err = new CustomError('There was a problem doing something in your app.');
  log(err.toJSON());
  throw err;
}

a();