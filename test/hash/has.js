test('return boolean if key exists', function() {
  var h = new Hash();
  h.set('hello', 'universe');
  h.has('hello').should.be.a('boolean', true);
  h.has('universe').should.be.a('boolean', false);
});

test('return false if key was deleted', function() {
  var h = new Hash();
  h.set('hello', 'universe');
  h.has('hello').should.be.true;
  h.del('hello');
  h.has('hello').should.be.false;
});

test('return true if a key has value of null', function() {
  var h = new Hash();
  h.set('hello', null);
  h.has('hello').should.be.true;
});

test('not include js object helpers', function() {
  var h = new Hash();
  h.has('hasOwnProperty').should.be.false;
  h.has('__proto__').should.be.false;
  h.has('constructor').should.be.false;
});
