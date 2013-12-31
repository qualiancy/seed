test('return value at index', function() {
  var h = new Hash({ arthur: 'dent', ford: 'prefect' });
  h.at(0).should.equal('dent');
  h.at(1).should.equal('prefect');
  assert.equal(h.at(2), undefined);
});
