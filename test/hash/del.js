test('set key\'s value to undefined', function() {
  var h = new Hash({ hello: 'universe' });
  h.del('hello');
  Object.keys(h._data).should.include('hello');
  assert.equal(h._data.hello, undefined);
});
