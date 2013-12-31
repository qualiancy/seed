test('assign value to key', function() {
  var h = new Hash();
  h.set('hello', 'universe');

  h.should
    .have.property('_data')
    .with.property('hello', 'universe');
});

test('set js object helpers', function() {
  var h = new Hash();
  h.set('defineProperty', 5);

  h.should
    .have.property('_data')
    .with.property('defineProperty', 5);
});
