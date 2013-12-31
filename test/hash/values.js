test('include all of values', function() {
  var h = new Hash(hashFixture);
  var i = 0;
  var l = Object.keys(hashFixture).length;
  var vals = h.values;

  vals.should
    .be.an('array')
    .with.length(l);

  Object.keys(hashFixture).forEach(function(line) {
    vals[i].should.equal(hashFixture[line]);
    i++;
  });
});

test('not include deleted items', function() {
  var h = new Hash(hashFixture);
  var l = Object.keys(hashFixture).length;
  h.values.should.have.length(l);
  h.del('United States');
  h.values.should.have.length(l - 1);
});
