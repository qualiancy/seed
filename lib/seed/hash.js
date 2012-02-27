/*!
 * Seed :: Hash
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var util = require('util')
  , Query = require('filtr');

/*!
 * Seed component dependancies
 */

var utils = require('./utils')
  , SeedError = require('./error')
  , EventEmitter = require('./events')

/*!
 * Basic comparators
 */

var comparator = {};

comparator.ASC = function (a, b) {
  return a.value - b.value;
};

comparator.DESC = function (a, b) {
  return b.value - a.value;
};

comparator.KASC = function (a, b) {
  var A = a.key.toLowerCase()
    , B = b.key.toLowerCase();
  if (A < B) return -1;
  else if (A > B) return 1;
  else return 0;
};

comparator.KDESC= function (a, b) {
  var A = a.key.toLowerCase()
    , B = b.key.toLowerCase();
  if (A < B) return 1;
  else if (A > B) return -1;
  else return 0;
};

/*!
 * Main export
 */

module.exports = Hash;

/**
 * # Hash (constructor)
 *
 * Creates a new hash given a set of values and options.
 *
 * Options:
 *
 * *
 *
 * @param {Array} values to insert
 * @param {Object} options
 * @api public
 * @name constructor
 */

function Hash (values, opts) {
  EventEmitter.call(this);

  this.opts = opts || {};
  this._data = Object.create(null);
  for (var key in values) {
    this.set(key, values[key], true);
  }
}

/*!
 * Inherits from Drip Event Emitter
 */

util.inherits(Hash, EventEmitter);

/**
 * # length
 *
 * Returns the the number of objects in the hash
 *
 * @returns {Number}
 * @api public
 * @name length
 */

Object.defineProperty(Hash.prototype, 'length',
  { get: function () {
      return this.keys.length;
    }
});

/**
 * # keys
 *
 * Returns an Array of all keys in the hash.
 *
 * @returns {Array} keys
 * @api public
 * @name keys
 */

Object.defineProperty(Hash.prototype, 'keys',
  { get: function () {
      var keys = []
        , value;
      for (var key in this._data) {
        value = this._data[key];
        if ('undefined' != typeof value)
          keys.push(key);
      }
      return keys;
    }
});

/**
 * # values
 *
 * Returns an array of all values in the hash.
 *
 * @returns {Array} values
 * @api public
 * @name values
 */

Object.defineProperty(Hash.prototype, 'values',
  { get: function () {
      var vals = []
        , value;
      for (var key in this._data) {
        value = this._data[key];
        if ('undefined' != typeof value)
          vals.push(value);
      }
      return vals;
    }
});

/*!
 * # validate
 *
 * Possible schema implementation.
 *
 * @api experimental
 */

Hash.prototype.validate = function () {
  return true;
};

/**
 * # .get(key)
 *
 * Gets the value of at a specific key.
 *
 * @param {String|Number} key
 * @returns {Object} value
 * @api public
 * @name .get()
 */

Hash.prototype.get = function (key) {
  return this._data[key];
};

/**
 * # .has(key)
 *
 * Checks for existence of key in hash.
 *
 * @param {String} key
 * @returns {Boolean} existence
 * @api public
 * @name .has()
 */

Hash.prototype.has = function (key) {
  var val = this._data[key];
  return !!val;
};

/**
 * # .set(key, value, [silent])
 *
 * Sets the value at a given key. By default, will emit a `set:[key]` event.
 *
 *      // To listen for all `set` events:
 *      the_hash.on([ 'set', '*'], listener);
 *
 * @param {String} key
 * @param {Object} value
 * @param {Boolean} silent defaults to false
 * @api public
 * @name .set()
 */

Hash.prototype.set = function (key, value, silent) {
  this._data[key] = value;
  if (!silent) {
    this.emit([ 'set', key ], value);
  }
};

/**
 * # .del(key, [silent])
 *
 * Removes a key from the Hash. By default, will emit a `delete:[key]` event.
 *
 *      // To listen for all `delete` events:
 *      the_hash.on([ 'delete', '*' ], listener);
 *
 * @param {String} key
 * @param {Boolean} silent defaults to false
 * @api public
 * @name .del()
 */

Hash.prototype.del = function (key, silent) {
  this._data[key] = undefined;
  if (!silent) {
    this.emit([ 'delete', key ]);
  }
};

/**
 * # .clone()
 *
 * Returns a copy of the hash.
 *
 * TODO: Deep cloning to remove all references. Perhaps optional.
 *
 * @returns {Hash} cloned
 * @api public
 * @name .clone()
 */

Hash.prototype.clone = function () {
  var hash = new Hash(null, this.opts);
  utils.merge(hash._data, this._data);
  return hash;
};

/**
 * # .at(index)
 *
 * Returns the data at a given index, as if the hash as an array.
 *
 * @param {Number} index
 * @returns {Object} value at index
 * @api public
 * @name .at()
 */

Hash.prototype.at = function (index) {
  var key = this.keys[index];
  return this._data[key];
};

/**
 * # .index(key)
 *
 * Returns the index for a given key, as if the hash was an array.
 *
 * @param {String} key
 * @returns {Number} index
 * @api public
 * @name .index()
 */

Hash.prototype.index = function (key) {
  return this.keys.indexOf(key);
};

/**
 * # .each(iterator, [context])
 *
 * Apply a given iteration function to each value in the hash.
 *
 * @param {Function} iterator
 * @param {Object} context to apply as `this` to iterator. Defaults to current hash.
 * @api public
 * @name .each()
 */

Hash.prototype.each = function (iterator, context) {
  var index = 0;
  context = context || this;
  for (var key in this._data) {
    iterator.call(context, this._data[key], key, index);
    index++;
  }
};

/**
 * # .map(iterator, [context])
 *
 * Map a given function to every value in the Hash. Iterator must return new value.
 *
 * @param {Function} iterator
 * @param {Object} content to apply as `this` to iterator. Defults to current hash.
 * @api public
 * @name .map()
 */

Hash.prototype.map = function (iterator, context) {
  var hash = utils.merge({}, this._data)
    , context = context || this;
  this.each(function(value, key, index) {
    hash[key] = iterator.call(context, hash[key], key, index);
  });
  return new Hash(hash);
};

/**
 * # .filter(iterator, [context])
 *
 * Creates a new hash with all key/values that pass a given iterator test.
 * Iterator should return `true` or `false`.
 *
 * TODO: Depreciate `select` alias.
 *
 * @param {Function} iterator
 * @param {Object} context to apply as `this` to iterator. Defaults to current hash.
 * @api public
 * @name .filter()
 */

Hash.prototype.filter = function (iterator, context) {
  var hash = new Hash(null, this.opts)
    , context = context || this;
  this.each(function(value, key, index) {
    if (iterator.call(context, value, key, index)) {
      hash.set(key, value, true);
    }
  });
  return hash;
};

/**
 * # .find(query)
 *
 * Creates a new hash with all elements that pass a given query.
 * Query language is provided by [filtr](https://github.com/logicalparadox/filtr).
 *
 * @param {Object} query
 * @returns {Hash}
 * @see https://github.com/logicalparadox/filtr
 * @api public
 * @name .find()
 */

Hash.prototype.find = function (query) {
  var q = new Query(query)
    , stack = []
    , hash = new Hash(null, this.opts)
    , root = this.opts.findRoot;
  this.each(function(value) {
    if (root) {
       stack.push(value[root]);
    } else {
       stack.push(value);
    }
  });
  var res = q.test(stack, { spec: 'boolean' });
  this.each(function(value, key, index) {
    if (res[index])
      hash.set(key, value);
  });
  return hash;
};

/**
 * # .sort(iterator)
 *
 * Creates a new hash sorted with an iterator
 *
 * Options:
 * - **kasc**: key alphabetical (default)
 * - **kdesc**: key alphabetical descending
 * - **asc**: value ascending, only if value is not object
 * - **desc**: value descending, only if value is not object
 * - **{Function}**: provide custom iterator
 *
 * Custom Iterator:
 *
 *    hash.sort(function (a, b) {
 *      var akey = a.key
 *        , avalue = a.value;
 *      // etc..
 *      return 1 || -1 || 0; // choose
 *    });
 *
 * @param {String|Function} iterator
 * @returns {this} for chaining
 * @api public
 * @name .sort()
 */

Hash.prototype.sort = function (iter) {
  var iterator;

  // default to key asc
  if (!iter) iter = 'kasc';

  // if we are passed a custom iterator
  if ('function' == typeof iter) iterator = iter;

  // else we have a string and an iterator
  else if ('string' == typeof iter) {
    iter = iter.toUpperCase();
    if (comparator[iter]) iterator = comparator[iter];
  }

  // final checks
  if ('function' !== typeof iterator)
    throw new SeedError('Poorly formed Hash#sort');

  var arr = this.toArray().sort(iterator)
  this.flush(true);

  for (var i = 0; i < arr.length; i++) {
    var key = arr[i].key
      , val = arr[i].value;
    if ('undefined' !== typeof val)
      this.set(key, val, true);
  }

  return this;
};

/**
 * * .sortBy (path, comparator)
 *
 * Helper for sorting hash of objects by a path.
 *
 *     hash.sortBy('stats.age', 'asc');
 *
 * Options:
 * - **asc**
 * - **desc**
 *
 * @param {String} path
 * @param {String} iterator (asc||desc)
 * @api public
 * @name sortBy
 */

Hash.prototype.sortBy = function (path, iter) {
  var iterator;
  if (iter == 'asc') {
    iterator = function (a, b) {
      var vala = Query.getPathValue(path, a.value)
        , valb = Query.getPathValue(path, b.value);
      return vala - valb;
    }
  } else if (iter == 'desc') {
    iterator = function (a, b) {
      var vala = Query.getPathValue(path, a.value)
        , valb = Query.getPathValue(path, b.value);
      return valb - vala;
    }
  } else {
    throw new SeedError('Poorly formed Hash#sortBy');
  }

  this.sort(iterator);
  return this;
};

/**
 * # .clean()
 *
 * Helper function to remove all keys that have an
 * `undefined` value. Useful, as `del` leaves keys.
 *
 * @api public
 * @name clean
 */

Hash.prototype.clean = function () {
  var arr = this.toArray();
  this.flush(true);

  // repopulate with clean data
  for (var i = 0; i < arr.length; i++) {
    var key = arr[i].key
      , val = arr[i].value;
    if ('undefined' !== typeof val)
      this.set(key, val, true);
  }

  return this;
};

/**
 * # .flush(silent)
 *
 * Helper function to remove all values from a hash.
 * By default, will emit a `flush` event.
 *
 * @param {Boolean} silent
 * @api public
 * @name flush
 */

Hash.prototype.flush = function (silent) {
  delete this._data;
  this._data = Object.create(null);
  if (!silent) this.emit('flush');
  return this;
};

/**
 * # .toArray()
 *
 * Returns the hash as javascript array in the format `{ key: [key], value: [value] }`.
 *
 * @returns {Array}
 * @api public
 * @name .toArray()
 */

Hash.prototype.toArray = function () {
  var self = this
    , arr = [];
  this.each(function (value, key) {
    if (self.has(key)) {
      var obj = { key: key, value: value };
      arr.push(obj);
    }
  });
  return arr;
};
