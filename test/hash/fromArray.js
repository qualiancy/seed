test('populate hash from array of key/value pairs', function() {
  var h = new Hash();

  h.fromArray([
      { key: 'arthur', value: 'dent' }
    , { key: 'ford', value: 'prefect' }
  ]);

  h.keys.should.include('arthur', 'ford');
  h.values.should.include('dent', 'prefect');
});
