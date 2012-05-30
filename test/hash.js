var chai = require('chai')
  , should = chai.should();

var Seed = require('..')
  , Hash = Seed.Hash;

var fs = require('fs')
  , path = require('path');

describe('Hash', function () {

  var data_raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'countries.json'), 'utf-8')
    , data = JSON.parse(data_raw)
    , expected_length = 238;

  describe('getters', function () {
    it('should have length', function () {
      var hash = new Hash(data);
      hash.length.should.equal(expected_length);
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

        hash.on('set:*', function () {
          n++;
        });

        hash.set('hello', 'world');
        n.should.equal(1);
      });
    });

    describe('HAS', function () {
      it('should work for all values', function () {
        var hash = new Hash(data)
        for (var key in data) {
          hash.has(key).should.be.true;
        }
      });

      it('should return false for non existent keys', function () {
        var hash = new Hash(data);
        hash.has('hello').should.be.false;
        hash.has('hasOwnProperty').should.be.false;
        hash.has('__proto__').should.be.false;
        hash.has('constructor').should.be.false;
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

        hash.on('delete:*', function () {
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

      hash.keys.should.include('Nation of Seed.js');
      hash2.keys.should.not.include('Nation of Seed.js');
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
        , n = 0
        , s = 0;

      var hash2 = hash.map(function (d, k, i) {
        d.should.equal(data[k]);
        i.should.equal(n);
        n++;
        s += d;
        return d + 1;
      });

      it('should iterate over all object in hash', function () {
        n.should.equal(expected_length);
      });

    });

    describe('#reduce', function () {
      var hash = new Hash(data)
        , n = 0;

      it('should be able to reduce', function () {
        var res =hash.reduce(function (value, key) {
          return 1;
        });

        res.should.equal(hash.length);
      });

      it('should be able to map reduce', function () {

        var mapFn = function (key, value, emit) {
          var firstLetter = key[0].toUpperCase();
          emit(firstLetter, value);
        }

        var reduceFn = function (key, values) {
          var res = 0;
          values.forEach(function (v) {
            res += v;
          });
          return res;
        }

        var result = hash.mapReduce(mapFn, reduceFn);
        chai.expect(result._data).eql({
           A: 164634460,
           B: 499541913,
           C: 1612921712,
           D: 16332279,
           E: 201923164,
           F: 71801966,
           G: 153667627,
           H: 34962898,
           I: 1616633286,
           J: 135946476,
           K: 139914902,
           L: 29208715,
           M: 265693642,
           N: 235034558,
           O: 3027959,
           P: 387744743,
           Q: 848016,
           R: 172014868,
           S: 286525125,
           T: 243917984,
           U: 492263162,
           V: 118519363,
           W: 3091113,
           Y: 24133492,
           Z: 25965640
        });
      });
    });

    describe('#find', function () {
      var hash = new Hash(data);

      it('should allow for basic finding', function () {
        var hash2 = hash.find({ $gt: 100000000 });
        hash2.should.have.length(12);
      });

      it('should allow for multiple findings', function () {
        var hash2 = hash.find({ $gt: 100000000, $lt: 300000000 });
        hash2.should.have.length(9);
      });

      it('should allow for nested findings', function () {
        var hash2 = hash.find({ $or: [ { $gt: 300000000 }, { $lt: 10000 } ]});
        hash2.should.have.length(17);
      });
    });

    describe('#select', function () {
      var hash = new Hash(data)
        , n = 0;

      var hash2 = hash.filter(function (d, k) {
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

      it('should return all objects sorted ASC', function () {
        hash.sort('asc');
        hash.length.should.equal(expected_length);
        hash.index('Pitcairn Islands').should.equal(0);
        hash.at(0).should.equal(hash.get('Pitcairn Islands'));
      });

      it('should return all objects sorted DESC', function () {
        hash.sort('desc');
        hash.length.should.equal(expected_length);
        hash.index('China').should.equal(0);
        hash.at(0).should.equal(hash.get('China'));
      });

      it('should return all objects sorted KASC', function () {
        hash.sort('kasc');
        hash.length.should.equal(expected_length);
        hash.index('China').should.equal(43);
        hash.at(43).should.equal(hash.get('China'));
      });

      it('should return all objects sorted KASC (default)', function () {
        hash.sort();
        hash.length.should.equal(expected_length);
        hash.index('China').should.equal(43);
        hash.at(43).should.equal(hash.get('China'));
      });

      it('should return all objects sorted KDESC', function () {
        hash.sort('kdesc');
        hash.length.should.equal(expected_length);
        hash.index('China').should.equal(194);
        hash.at(194).should.equal(hash.get('China'));
      });

      it('should return all objects sorted by a custom function', function () {
        // alphabetical
        hash.sort(function (a, b) {
          var A = a.key.toLowerCase()
            , B = b.key.toLowerCase();
          if (A < B) return -1;
          else if (A > B) return  1;
          else return 0;
        });

        hash.length.should.equal(expected_length);
        hash.index('China').should.equal(43);
        hash.at(43).should.equal(hash.get('China'));
      });

    });

  });
});
