test('all keys exist', function() {
  var h = new Hash(hashFixture);
  var keys = Object.keys(hashFixture);
  h.keys.should.deep.equal(keys);
});

test('deleted keys omitted', function() {
  var h = new Hash(hashFixture);
  var keys = Object.keys(hashFixture);
  h.keys.should.include('United States');
  h.del('United States');
  h.keys.should.not.include('United States');
});
