var Sherlock = require('sherlock')
  , assert = Sherlock.assert;

var Seed = require('..');

var fs = require('fs')
  , path = require('path');

var investigation = new Sherlock.Investigation('Seed#Hash', function (test, done) {
  
  var data_raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'countries.json'), 'utf-8')
    , data = JSON.parse(data_raw)
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
    // assert.isEmpty(hash._data, 'inner structure confirms all items removed');
    done();
  });
  
  test('Hash#clone', function (test, done) {
    var hash = new Seed.Hash(data)
      , hash2 = hash.clone();
    
    hash.set('Nation of Open Source', 10000000);
    assert.equal(hash.length, expected_length +1, 'added 1 to hash');
    assert.equal(hash2.length, expected_length, 'didn\'t add 1 to clone hash');
    done();
  });
  
  test('Hash#at', function (test, done) {
    var hash = new Seed.Hash(data)
      , spy = Sherlock.Spy()
      , index = 0;
    
    for (var key in data) {
      assert.equal(data[key], hash.at(index), 'correct value returned for `at`');
      assert.isNotNull(hash.at(index), 'value is returned');
      index++;
      spy();
    }
    
    assert.equal(spy.calls.length, expected_length, 'all tests fired');
    done();
  });
  
  test('Hash#index', function (test, done) {
    var hash = new Seed.Hash(data)
      , spy = Sherlock.Spy()
      , index = 0;
    
    for (var key in data) {
      assert.equal(index, hash.index(key), 'correct value returned for `index`');
      index++;
      spy();
    }
    
    assert.equal(spy.calls.length, expected_length, 'all tests fired');
    done();
  });
  
  test('Hash#each', function (test, done) {
    var hash = new Seed.Hash(data)
      , index = 0;
    
    var spy = Sherlock.Spy(function (d, k, i) {
      assert.equal(index, i, 'counting match');
      assert.equal(data[k], d, 'data matches');
      index++;
    });
    
    hash.each(spy);
    
    assert.equal(spy.calls.length, expected_length, 'all tests fired');
    assert.equal(index, expected_length, 'double check');
    done();
  });
  
  test('Hash#map', function (test, done) {
    var hash = new Seed.Hash(data)
      , index = 0;
    
    var spy = Sherlock.Spy(function (d, k) {
      assert.equal(data[k], d, 'data matches');
      index++;
      return d + 1;
    });
    
    hash.map(spy);
    
    assert.equal(spy.calls.length, expected_length, 'all tests fired');
    assert.equal(index, expected_length, 'double check');
    done();
  });
  
  test('Hash#select', function (test, done) {
    var hash = new Seed.Hash(data)
      , index = 0;
    
    var hash2 = hash.select(function (d, k) {
      assert.equal(data[k], d, 'data matches');
      index++;
      return (index <= 10) ? true : false;
    });
    
    assert.equal(index, expected_length, 'all items checked');
    assert.equal(hash2.length, 10, 'only first 10 items included');
    done();
  });
  
  test('Hash#keys', function (test, done) {
    var hash = new Seed.Hash(data)
      , index = 0;
    
    var keys = hash.keys();
    
    assert.equal(keys.length, expected_length, 'all items checked');
    done();
  });
  
  test('Hash#values', function (test, done) {
    var hash = new Seed.Hash(data)
      , index = 0;
    
    var values = hash.values();
    
    assert.equal(values.length, expected_length, 'all items checked');
    done();
  });
  
  test('Hash#toArray', function (test, done) {
    var hash = new Seed.Hash(data)
      , index = 0;
    
    var arr = hash.toArray();
    
    assert.isArray(arr, 'its an array');
    assert.equal(arr.length, expected_length, 'all items checked');
    done();
  });
  
  test('Hash#toJSON', function (test, done) {
    var hash = new Seed.Hash(data)
      , index = 0;
    
    var json = hash.toJSON();
    
    assert.isString(json, 'its an string');
    assert.equal(json, data_raw, 'matches original file');
    done();
  });
  
  done();
});

module.exports = investigation;