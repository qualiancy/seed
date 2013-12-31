test('return an array of key/value pairs', function() {
  var h = new Hash({ arthur: 'dent', ford: 'prefect' });
  h.toArray().should.deep.equal([
      { key: 'arthur', value: 'dent' }
    , { key: 'ford', value: 'prefect' }
  ]);
});
