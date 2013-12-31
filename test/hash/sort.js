test('kasc (default)', function() {
  var h = new Hash(hashFixture);
  h.sort();
  h.index('China').should.equal(43);
  h.at(43).should.equal(h.get('China'));
});

test('kasc', function() {
  var h = new Hash(hashFixture);
  h.sort('kasc');
  h.index('China').should.equal(43);
  h.at(43).should.equal(h.get('China'));
});

test('kdesc', function() {
  var h = new Hash(hashFixture);
  h.sort('kdesc');
  h.index('China').should.equal(194);
  h.at(194).should.equal(h.get('China'));
});

test('asc', function() {
  var h = new Hash(hashFixture);
  h.sort('asc');
  h.index('Pitcairn Islands').should.equal(0);
  h.at(0).should.equal(h.get('Pitcairn Islands'));
});

test('desc', function() {
  var h = new Hash(hashFixture);
  h.sort('desc');
  h.index('China').should.equal(0);
  h.at(0).should.equal(h.get('China'));
});

test('fn', function() {
  var h = new Hash(hashFixture);

  // alphabetical
  h.sort(function (a, b) {
    var A = a.key.toLowerCase();
    var B = b.key.toLowerCase();
    if (A < B) return -1;
    else if (A > B) return  1;
    else return 0;
  });

  h.index('China').should.equal(43);
  h.at(43).should.equal(h.get('China'));
});
