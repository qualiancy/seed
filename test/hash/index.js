test('return index of key', function() {
  var h = new Hash({ arthur: 'dent', ford: 'prefect' });
  h.index('arthur').should.equal(0);
  h.index('ford').should.equal(1);
  h.index('zaphod').should.equal(-1);
  (function () {
    return !~h.index('arthur')
      ? true
      : false
  })().should.equal(false);
});
