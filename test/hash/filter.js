test('returns new hash filtered by an iterator', function() {
  var h = new Hash(hashFixture);
  var n = 0;

  var res = h.filter(function(d, k, i) {
    d.should.equal(hashFixture[k]);
    i.should.equal(n);
    n++;
    return n <= 10 ? true : false;
  });

  n.should.equal(h.length);
  res.should.be.instanceof(Hash);
  res.should.have.length(10);
});
