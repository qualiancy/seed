var util = require('util')
  , Drip = require('drip');

var utils = require('./utils')
  , comparator = require('./comparator')
  , Query = require('./query');

module.exports = Hash;

function Hash (values) {
  Drip.call(this, { delimeter: ':' });
  this._data = {};
  for (var key in values) {
    this.set(key, values[key], true);
  }
  this.initialize();
}

util.inherits(Hash, Drip);

Hash.prototype.initialize = function () {};

Object.defineProperty(Hash.prototype, 'length',
  { get: function () {
      var arr = this.toArray();
      return arr.length;
    }
});

Object.defineProperty(Hash.prototype, 'sum',
  { get: function () {
      var sum = 0;
      this.each(function (value) {
        if (value && 'number' === typeof value) {
          sum+= value;
        }
      });
      return sum;
    }
});

Object.defineProperty(Hash.prototype, 'avg',
  { get: function () {
      var count = 0
        , sum = 0;
      this.each(function (value) {
        if (value && 'number' === typeof value) {
          count++;
          sum+= value;
        }
      });
      return (sum / count) ? (sum / count) : 0;
    }
});

Object.defineProperty(Hash.prototype, 'min',
  { get: function () {
      var hash = this.clone();
      hash.each(function (value, key) {
        if (!(value && 'number' === typeof value)) {
          hash.del(key, true);
        }
      });
      return hash.sort(comparator.ASC).at(0);
    }
});

Object.defineProperty(Hash.prototype, 'max',
  { get: function () {
      var hash = this.clone();
      hash.each(function (value, key) {
        if (!(value && 'number' === typeof value)) {
          hash.del(key, true);
        }
      });
      return hash.sort(comparator.DESC).at(0);
    }
});

Object.defineProperty(Hash.prototype, 'keys',
  { get: function () {
      return Object.keys(this._data);
    }
});

Object.defineProperty(Hash.prototype, 'values',
  { get: function () {
      var vals = [];
      this.each(function(value) {
        vals.push(value);
      });
      return vals;
    }
});

Hash.prototype.validate = function () {
  return true;
};

Hash.prototype.get = function (key) {
  return this._data[key];
};

Hash.prototype.set = function (key, value, silent) {
  var obj = {};
  obj[key] = value;
  this._data[key] = value;
  if (!silent) {
    this.emit([ 'set', key ], value);
  }
};

Hash.prototype.del = function (key, silent) {
  if (this._data[key]) delete this._data[key];
  if (!silent) {
    this.emit([ 'delete', key ]);
  }
};

Hash.prototype.clone = function () {
  var hash = new Hash();
  utils.merge(hash._data, this._data);
  return hash;
};

Hash.prototype.at = function (index) {
  var key = this.keys[index];
  return this._data[key];
};

Hash.prototype.index = function (key) {
  return this.keys.indexOf(key);
};

Hash.prototype.each = function (iterator, context) {
  var index = 0;
  context = context || this;
  for (var key in this._data) {
    iterator.call(context, this._data[key], key, index);
    index++;
  }
};

Hash.prototype.map = function (iterator, context) {
  var hash = utils.merge({}, this._data)
    , context = context || this;
  this.each(function(value, key, index) {
    hash[key] = iterator.call(context, hash[key], key, index);
  });
  return new Hash(hash);
};

Hash.prototype.select = function (iterator, context) {
  var hash = new Hash()
    , context = context || this;
  this.each(function(value, key, index) {
    if (iterator.call(context, value, key, index)) {
      hash.set(key, value, true);
    }
  });
  return hash;
};

Hash.prototype.find = function (path, query) {
  if ('object' === typeof path) {
    query = path;
    path = null;
  }

  // not implementing path based querying yet

  var q = new Query(query)
    , hash = new Hash();
  this.each(function (value, key) {
    if (q.test(value)) hash.set(key, value);
  });
  return hash;
};

Hash.prototype.sort = function (iterator) {
  var arr = this.toArray().sort(iterator)
    , hash = new Hash();
  for (var i in arr) {
    var item = arr[i];
    hash.set(item.key, item.value);
  }
  return hash;
};

Hash.prototype.toArray = function () {
  var arr = [];
  this.each(function (value, key) {
    var obj = { key: key, value: value };
    arr.push(obj);
  });
  return arr;
};

Hash.prototype.serialize = function () {
  return JSON.stringify(this._data);
};
