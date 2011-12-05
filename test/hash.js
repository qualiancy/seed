var should = require('should');

var Seed = require('..')
  , Hash = Seed.Hash;

var fs = require('fs')
  , path = require('path');

describe('Hash', function () {

  var data_raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'countries.json'), 'utf-8')
    , data = JSON.parse(data_raw)
    , expected_length = 238;

  it('should have a version', function () {
    should.exist(Seed.version);
  });

  describe('getters', function () {
    it('should have length', function () {
      var hash = new Hash(data);
      hash.length.should.equal(expected_length);
    });

    it('should have sum', function () {
      var hash = new Hash(data);

      hash.length.should.equal(expected_length);
      hash.sum.should.equal(6936269063);
    });

    it('should have average', function () {
      var hash = new Hash(data);

      hash.length.should.equal(expected_length);
      hash.avg.should.equal(29143987.659663867);
    });

    it('should have minimum', function () {
      var hash = new Hash(data);

      hash.length.should.equal(expected_length);
      hash.min.should.equal(48);
    });

    it('should have maximum', function () {
      var hash = new Hash(data);

      hash.length.should.equal(expected_length);
      hash.max.should.equal(1336718015);
    });

    it('should have an array list of keys', function () {
      var hash = new Hash(data)
        , keys = hash.keys;

      keys.should.be.instanceof(Array);
      keys.length.should.equal(expected_length);
    });

    it('should have an array of values', function () {
      var hash = new Hash(data)
        , values = hash.values;

      values.should.be.instanceof(Array);
      values.length.should.equal(expected_length);
    });
  });


  describe('modifiers', function () {
    it('GET should work for all values', function () {
      var hash = new Hash(data)
        , n = 0;

      for (var key in data) {
        hash.get(key).should.equal(data[key]);
        n++;
      }

      hash.length.should.equal(expected_length);
      n.should.equal(hash.length);
    });

    describe('SET', function () {
      it('should work for all values', function () {
        var hash = new Hash();

        for (var key in data) {
          hash.set(key, data[key]);
        }

        hash.length.should.equal(expected_length);
      });

      it('should emit `set` event', function () {
        var hash = new Hash()
          , n = 0;

        hash.on('set', function () {
          n++;
        });

        hash.set('hello', 'world');
        n.should.equal(1);
      });
    });

    describe('DEL', function() {
      it('should work for all values', function () {
        var hash = new Hash(data)
          , count = expected_length;

        for (var key in data) {
          hash.length.should.equal(count);
          hash.del(key);
          count--;
        }

        hash.length.should.equal(0);
      });

      it('should emit `delete` event', function () {
        var hash = new Hash()
          , n = 0;

        hash.on('delete', function () {
          n++;
        });

        hash.set('hello', 'world');
        hash.del('hello');

        n.should.equal(1);
      });
    });
  });

  describe('utilities', function () {
    it('should allow for hash cloning', function () {
      var hash = new Hash(data)
        , hash2 = hash.clone();

      hash.set('Nation of Seed.js', 10000000);

      hash.keys.should.contain('Nation of Seed.js');
      hash2.keys.should.not.contain('Nation of Seed.js');
    });

    it('should produce an Array of key/value objects', function () {
      var hash = new Hash(data)
        , index = 0;

      var arr = hash.toArray();

      arr.should.be.instanceof(Array);
      arr.length.should.equal(expected_length);
      arr[0].key.should.equal('Afghanistan');
      arr[0].value.should.equal(29835392);
    });

    it('should allow for JSON string output', function () {
      var hash = new Hash(data)
        , json = hash.serialize();

      json.should.be.a('string');
      json.should.equal(data_raw);
    });
  });

  describe('position #at', function () {
    it('should return the correct item for an index', function () {
      var hash = new Hash(data)
        , n = 0;

      for (var key in data) {
        hash.at(n).should.equal(data[key]);
        n++;
      }

      n.should.equal(expected_length);
    });
  });

  describe('position #index', function () {
    it('should return the correct location for an item', function () {
      var hash = new Hash(data)
        , n = 0;

      for (var key in data) {
        hash.index(key).should.equal(n);
        n++;
      }

      n.should.equal(expected_length);
    });
  });

  describe('iteration', function () {
    describe('#each', function () {
      it('should iterate over all objects in hash', function () {
        var hash = new Hash(data)
          , n = 0;

        hash.each(function (d, k, i) {
          i.should.equal(n);
          d.should.equal(data[k]);
          n++;
        });

        n.should.equal(expected_length);
      });
    });

    describe('#map', function () {
      var hash = new Hash(data)
        , n = 0;

      var hash2 = hash.map(function (d, k, i) {
        d.should.equal(data[k]);
        i.should.equal(n);
        n++;
        return d + 1;
      });

      it('should iterate over all object in hash', function () {
        n.should.equal(expected_length);
      });

      it('should return a new value for a new hash', function () {
        hash2.sum.should.equal(hash.sum + expected_length);
      });

    });

    describe('#select', function () {
      var hash = new Hash(data)
        , n = 0;

      var hash2 = hash.select(function (d, k) {
        d.should.equal(data[k]);
        n++;
        return (n <= 10) ? true : false;
      });

      it('should iterate over all object in hash', function () {
        n.should.equal(expected_length);
      });

      it('should return a subselection of the original hash', function () {
        hash2.length.should.equal(10);
      });
    });

    describe('#sort', function () {
      var hash = new Hash(data);

      describe('when sorted ASC', function () {
        var sorted = hash.sort(Seed.Comparator.ASC);

        it('should return all objects in the correct order', function () {
          sorted.length.should.equal(expected_length);
          sorted.index('Pitcairn Islands').should.equal(0);
          sorted.at(0).should.equal(sorted.get('Pitcairn Islands'));
        });
      });

      describe('when sorted DESC', function () {
        var sorted = hash.sort(Seed.Comparator.DESC);

        it('should return all objects in the correct order', function () {
          sorted.length.should.equal(expected_length);
          sorted.index('China').should.equal(0);
          sorted.at(0).should.equal(sorted.get('China'));
        });
      });
    });

  });
});