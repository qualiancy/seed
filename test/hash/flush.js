test('remove all pairs in a hash', function() {
  var h = new Hash({ arthur: 'dent', ford: 'prefect' });
  h.flush();
  h.should.have.length(0);
});
