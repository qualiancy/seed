test('retrieve value at key', function() {
  var h = new Hash();
  h._data['hello'] = 'universe';
  h.get('hello').should.equal('universe');
});

test('retrieve js object helpers', function() {
  var h = new Hash();
  h._data['defineProperty'] = 5;
  h.get('defineProperty').should.equal(5);
});
