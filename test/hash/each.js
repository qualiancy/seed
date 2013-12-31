test('iterates over each key/value pair', function() {
  var h = new Hash(hashFixture);
  var n = 0;

  h.each(function(d, k, i) {
    d.should.equal(hashFixture[k]);
    i.should.equal(n);
    n++;
  });

  n.should.equal(h.length);
});
