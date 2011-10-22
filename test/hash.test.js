var Sherlock = require('sherlock')
  , assert = Sherlock.assert;

var Seed = require('..');

var fs = require('fs')
  , path = require('path');

var investigation = new Sherlock.Investigation('Seed#Hash', function (test, done) {
  
  var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'countries.json'), 'utf-8'))
    , expected_length = 238;
  
  test('Seed#version', function (test, done) {
    assert.isNotNull(Seed.version);
    done();
  });
  
  test('Hash#length', function (test, done) {
    var hash = new Seed.Hash(data);
    assert.equal(hash.length, expected_length, 'all data loaded correctly');
    done();
  });
  
  test('Hash#get', function (test, done) {
    var hash = new Seed.Hash(data)
      , n = 0;
    
    for (var key in data) {
      assert.equal(hash.get(key), data[key]);
      n++;
    }
    
    assert.equal(hash.length, expected_length, 'all data loaded correctly');
    assert.equal(n, hash.length, 'all get functions valid');
    done();
  });
  
  test('Hash#set', function (test, done) {
    var hash = new Seed.Hash()
      , spy = Sherlock.Spy();
    
    hash.on('set', spy);
    
    for (var key in data) hash.set(key, data[key]);
    
    assert.equal(hash.length, expected_length, 'all data loaded correctly using set');
    assert.equal(spy.calls.length, hash.length, 'all events fired for `set`');
    done();
  });
  
  test('Hash#del', function (test, done) {
    var hash = new Seed.Hash(data)
      , spy = Sherlock.Spy(function (key) { assert.isNotNull(key); })
      , count = expected_length;
    
    hash.on('delete', spy);
    
    for (var key in data) {
      assert.equal(hash.length, count);
      hash.del(key);
      count--;
    }
    
    assert.equal(spy.calls.length, expected_length, 'all events fired for `del`');
    assert.equal(hash.length, 0, 'all items removed');
    done();
  });
  
  done();
});

module.exports = investigation;