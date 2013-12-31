test('should return a value', function() {
  var h = new Hash(hashFixture);
  var n = 0;

  var l = h.reduce(function(d, k, i) {
    d.should.equal(hashFixture[k]);
    i.should.equal(n);
    n++;
    return 1;
  });

  l.should.equal(h.length);
});
