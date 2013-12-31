test('include all values in original', function() {
  var h = new Hash(hashFixture);
  var c = h.clone();
  c.keys.should.deep.equal(h.keys);
  c.values.should.deep.equal(h.values);
});

test('does not share storage', function() {
  var h = new Hash(hashFixture);
  var c = h.clone();
  h.set('hello', 'universe');
  c.set('universe', 'hello');
  h.has('universe').should.be.false;
  c.has('hello').should.be.false;
});
