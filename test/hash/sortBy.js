test('asc (default)', function() {
  var h = new Hash(hashFixture);
  h = h.map(function(v) { return { population: v }; });
  h.sortBy('population');
  h.index('Pitcairn Islands').should.equal(0);
  h.at(0).should.deep.equal(h.get('Pitcairn Islands'));
});

test('asc', function() {
  var h = new Hash(hashFixture);
  h = h.map(function(v) { return { population: v }; });
  h.sortBy('population', 'asc');
  h.index('Pitcairn Islands').should.equal(0);
  h.at(0).should.deep.equal(h.get('Pitcairn Islands'));
});

test('desc', function() {
  var h = new Hash(hashFixture);
  h = h.map(function(v) {return { population: v }; });
  h.sortBy('population', 'desc');
  h.index('China').should.equal(0);
  h.at(0).should.equal(h.get('China'));
});
