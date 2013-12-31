test('correct length', function() {
  var h = new Hash(hashFixture);
  var l = Object.keys(hashFixture).length;

  h.should
    .have.property('length')
    .a('number')
    .that.equals(l);
});

test('account for deleted items', function() {
  var h = new Hash(hashFixture);
  var l = Object.keys(hashFixture).length;
  h.should.have.length(l);
  h.del('United States');
  h.should.have.length(l - 1);
});
