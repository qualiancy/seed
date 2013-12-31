test('removes deleted keys from a hash', function() {
  var h = new Hash({ arthur: 'dent', ford: 'prefect' });

  h.del('ford');

  h.should
    .have.property('_data').that
    .deep.equal({ arthur: 'dent', ford: undefined });

  h.clean();

  h.should
    .have.property('_data').that
    .deep.equal({ arthur: 'dent' });
});
