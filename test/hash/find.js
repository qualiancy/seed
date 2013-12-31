test('select based on a query', function() {
  var h = new Hash(hashFixture);

  var h2 = h.find({ $lt: 1000 });
  h2.should.be.instanceof(Hash);
  h2.should.have.length(3);
  h2.keys.should.include('Pitcairn Islands');
});

test('use a custom findRoot option', function() {
  var h = new Hash(hashFixture, { findRoot: 'population' });

  h = h.map(function(v) {
    return { population: v };
  });

  var h2 = h.find({ $lt: 1000 });
  h2.should.be.instanceof(Hash);
  h2.should.have.length(3);
  h2.keys.should.include('Pitcairn Islands');
});
