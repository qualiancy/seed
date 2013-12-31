test('returns new hash modified by iterator', function() {
  var h = new Hash(hashFixture);
  var n = 0;

  var h2 = h.map(function(d, k, i) {
    d.should.equal(hashFixture[k]);
    i.should.equal(n);
    n++;
    return d + 1;
  });

  h2.at(0).should.equal(h.at(0) + 1);
  n.should.equal(h.length);
});
