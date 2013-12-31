/*!
 * Seed :: Hash
 * Copyright(c) 2011-2014 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

// external utilities
var debug = require('sherlock')('seed:hash');
var extend = require('params').extend;
var pathval = require('pathval');
var type = require('type-detect');

// internal constructors
var Filter = require('../filter').Filter;

// internal utilties
var comparators = require('./comparators');

/**
 * Creates a new hash given a set of values and options.
 *
 * @param {Object} key/value pairs to insert
 * @param {Object} options
 * @api public
 */

var Hash = exports.Hash = function Hash(values, opts) {
  this.opts = opts || {};
  this._data = Object.create(null);
  if (values) this.set(values);
}

Hash.prototype = {

  /**
   * Property that returns the the number of keys
   * in the hash.
   *
   * @return {Number} count of keys
   * @api public
   */

  get length() {
    return this.keys.length;
  },

  /**
   * Property that returns an array of all of the
   * keys with defined values in the hash.
   *
   * @return {Array} keys
   * @api public
   */

  get keys() {
    var keys = [];
    var value;

    for (var key in this._data) {
      value = this._data[key];
      if ('undefined' !== type(value)) keys.push(key);
    }

    return keys;
  },

  /**
   * Property that return an array of all of the
   * defined values in the hash. Order will be maintained.
   * `null` is considered a defined value, but `undefined` is not.
   *
   * @return {Array} values
   * @api public
   */

  get values() {
    var vals = [];
    var value;

    for (var key in this._data) {
      value = this._data[key];
      if ('undefined' !== type(value)) vals.push(value);
    }

    return vals;
  },

  /**
   * Sets the value at a given key.
   *
   * @param {String} key
   * @param {Object} value
   * @return {this} chainable
   * @api public
   */

  set: function(key, value) {
    if ('object' === type(key)) {
      for (var k in key) this.set(k, key[k]);
      return;
    }

    debug('(set) %s', key);
    this._data[key] = value;
    return this;
  },

  /**
   * Gets the value of at a specific key.
   *
   * @param {String} key
   * @return {Mixed} value
   * @api public
   */

  get: function(key) {
    return this._data[key];
  },

  /**
   * Checks for existence of key in hash.
   *
   * @param {String} key
   * @return {Boolean} existence
   * @api public
   */

  has: function(key) {
    return ~this.keys.indexOf(key) ? true : false;
  },

  /**
   * Removes a key from the Hash by setting it's
   * value to `undefined`. The key will no longer
   * be included in `h.keys` or `h.toArray()`. Will
   * be completely removed from internal storage
   * upon the next invocation of `h.clean()`.
   *
   * @param {String} key
   * @api public
   */

  del: function(key) {
    debug('(del) %s', key);
    this._data[key] = undefined;
    return this;
  },

  /**
   * Returns a copy of the hash.
   *
   * @return {Hash} cloned
   * @api public
   */

  clone: function() {
    var hash = new Hash(this._data, this.opts);
    return hash;
  },

  /**
   * Returns the data at a given index,
   * as if the hash as an array. Respects
   * the last `.sort()` or the order the
   * keys were defined.
   *
   * @param {Number} index
   * @return {Object} value at index
   * @api public
   */

  at: function(i) {
    var key = this.keys[i];
    return this._data[key];
  },

  /**
   * Returns the index for a given
   * key, as if the hash was an array.
   * Respects the last `.sort()` or the
   * order the keys were defined. Returns
   * `-1` if the key is not defined.
   *
   * @param {String} key
   * @return {Number} index
   * @api public
   */

  index: function(key) {
    return this.keys.indexOf(key);
  },

  /**
   * Returns the hash as javascript array with
   * each entry being an _{Object}_ of `key`/`value`
   * pairs.
   *
   * @return {Array}
   * @api public
   */

  toArray: function() {
    var arr = [];

    this.each(function(value, key) {
      if (!this.has(key)) return;
      arr.push({ key: key, value: value });
    });

    return arr;
  },

  /**
   * Sets values in this Hash from the result of
   * of a `sol.toArray` call. Array must have entries in
   * the format `{ key: [key], value: [value] }`.
   *
   * Any existing values with the same key wil be
   * overwritten. Any keys with the value of `undefined`
   * will be skipped.
   *
   * @param {Array} arr
   * @return {this} for chaining
   * @api public
   */

  fromArray: function(arr) {
    for (var i = 0; i < arr.length; i++) {
      var key = arr[i].key;
      var val = arr[i].value;
      if ('undefined' !== type(val)) {
        this.set(key, val);
      }
    }

    return this;
  },

  /**
   * Remove all key/value pairs from a hash.
   *
   * @return {this} for chaining
   * @api public
   */

  flush: function() {
    debug('(flush)');
    delete this._data;
    this._data = Object.create(null);
    return this;
  },

  /**
   * Helper function to remove all keys that have an
   * `undefined` value. Useful, as `del` leaves keys
   * in memory.
   *
   * @return {this} for chaining
   * @api public
   */

  clean: function() {
    var arr = this.toArray();
    this.flush().fromArray(arr);
    return this;
  },

  /**
   * Apply a given iteration function to
   * each value in the hash.
   *
   * @param {Function} iterator
   * @param {Object} context to apply as `this` to iterator. Defaults to current hash.
   * @return {this} for chaining
   * @api public
   */

  each: function(iter, ctx) {
    var i = 0;
    ctx = ctx || this;

    for (var key in this._data) {
      iter.call(ctx, this._data[key], key, i);
      i++;
    }

    return this;
  },

  /**
   * Map a given function to every value
   * in the Hash. Iterator must return new value.
   * Returns a new Hash.
   *
   * @param {Function} iterator
   * @param {Object} content to apply as `this` to iterator. Defults to current hash.
   * @return {Hash} modified new Hash
   * @api public
   */

  map: function(iter, ctx) {
    var hash = extend({}, this._data)
    ctx = ctx || this;

    this.each(function(value, key, i) {
      hash[key] = iter.call(ctx, hash[key], key, i);
    });

    return new Hash(hash, this.opts);
  },

  /**
   * Reduce a hash using the given iterator.
   *
   * @param {Function} iterator
   * @param {Object} context to apply as `this` to the iterator. Defaults to current hash.
   * @return {Mixed} result
   * @api public
   */

  reduce: function(iter, val, ctx) {
    if ('number' !== type(val)) ctx = val, val = 0;
    var res = val || 0;
    ctx = ctx || this;

    this.each(function(value, key, i) {
      res += iter.call(ctx, value, key, i);
    });

    return res;
  },

  /**
   * Divide and aggregate a hash based on arbitrary criteria.
   *
   * The `mapFunction` will be applied to each key/value
   * pair in the original hash. A group key and the value
   * to be added to that key's array may be emitted by
   * by this iterator.
   *
   * The `reduceFunction` will be applied to each group
   * key emitted by the `mapFunction`. This function should
   * return the new value for that key to be used in the final
   * Hash.
   *
   * This method will return a new Hash with unique keys emitted
   * by the `mapFunction` with values returned by the `reduceFunction`.
   *
   * The following example will return a hash with count of
   * last names that start with a specific letter.
   *
   * @param {Function} map function
   * @param {Function} reduce function
   * @return {Hash} new Hash of results
   * @api public
   */

  mapReduce: function(mapFn, reduceFn) {
    var hash = extend({}, this._data);
    var mapHash = new Hash(null, this.opts);
    var reduceHash = new Hash(null, this.opts);

    this.each(function(_value, _key) {
      mapFn(_key, _value, function emit(key, value) {
        if (mapHash.has(key)) {
          mapHash.get(key).push(value);
        } else {
          mapHash.set(key, [ value ]);
        }
      });
    });

    mapHash.each(function(_value, key) {
      var value = reduceFn(key, _value);
      reduceHash.set(key, value);
    });

    return reduceHash;
  },

  /**
   * Creates a new hash with all key/values
   * that pass a given iterator test. Iterator
   * should return `true` or `false`.
   *
   * @param {Function} iterator
   * @param {Object} context to apply as `this` to iterator. Defaults to current hash.
   * @return {Hash} new Hash of results
   * @api public
   */

  filter: function(iter, ctx) {
    var hash = new Hash(null, this.opts);
    ctx = ctx || this;

    this.each(function(val, key, i) {
      if (iter.call(ctx, val, key, i)) {
        hash.set(key, val);
      }
    });

    return hash;
  },

  /**
   * Creates a new hash with all elements that pass
   * a given query.
   *
   * If the hash is a storage mechanism for multiple _{Object}_
   * instances instances (such as database models}, the `findRoot`
   * option may be defined for the Hash. This option will be
   * transferred to all new result Hashes.
   *
   * @param {Object} query
   * @return {Hash} new Hash of results
   * @see https://github.com/qualiancy/gaia-filter gaia-filter
   * @api public
   */

  find: function(query) {
    var q = new Filter(query);
    var stack = [];
    var hash = new Hash(null, this.opts);
    var root = this.opts.findRoot;
    var res;

    this.each(function(value) {
      if (root) {
        var val = pathval.get(value, root);
        stack.push(val);
      } else {
        stack.push(value);
      }
    });

    res = q.pass(stack);

    this.each(function(value, key, index) {
      if (res[index]) hash.set(key, value);
    });

    return hash;
  },

  /**
   * Creates a new hash sorted with an iterator. Can use one
   * of the provided iterators or provide a custom function.
   *
   * Comparators:
   * - `'kasc'`: key alphabetical (default)
   * - `'kdesc'`: key alphabetical descending
   * - `'asc'`: value ascending, only if value is not object
   * - `'desc'`: value descending, only if value is not object
   * - _{Function}_: provide custom iterator
   *
   * Custom Comparator:
   *
   * The parameters for each to compare are an object
   * with `key` and `value` properties. See the `.toArray()`
   * method for more information.
   *
   * @param {String|Function} comparator
   * @return {this} for chaining
   * @api public
   */

  sort: function(iter) {
    var iterator;
    iter = iter || 'kasc';

    if ('function' == type(iter)) {
      iterator = iter;
    } else if ('string' == type(iter)) {
      iter = iter.toUpperCase();
      if (comparators[iter]) iterator = comparators[iter];
    }

    var arr = this.toArray().sort(iterator)
    this.flush(true);
    this.fromArray(arr);
    return this;
  },

  /**
   * Helper for sorting hash of objects by a path.
   *
   * Comparators:
   * - `'asc'`: value ascending
   * - `'desc'`: value descending
   * - _{Function}_: custom function to receive the value at path
   *
   * @param {String} path
   * @param {String|Function} comparator
   * @api public
   */

  sortBy: function(path, iter) {
    var key = iter ? ('string' === type(iter) ? iter.toUpperCase() : 'FN') : 'ASC';
    var fn = key === 'FN' ? iter : comparators[key];

    if ('function' !== type(fn)) {
      throw new ReferenceError('sortBy comparator "' + key+ '" does not exist');
    }

    return this.sort((function(path, key, fn) {
      return function iterate(a, b) {
        var vala = pathval.get(a.value, path);
        var valb = pathval.get(b.value, path);
        return key === 'FN' ? fn(vala, valb) : fn({ value: vala }, { value: valb });
      }
    })(path, key, fn));
  }

}; // Hash.prototype
