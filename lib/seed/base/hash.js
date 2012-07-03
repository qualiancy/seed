/*!
 * Seed :: Hash
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var inherits = require('super')
  , Sol = require('sol');

/*!
 * Seed component dependancies
 */

var Query = require('./query');

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
  Sol.call(this, values, opts);
}

/*!
 * Inherits from Sol
 */

inherits(Hash, Sol);

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

  // populate our query array
  this.each(function(value) {
    if (root) stack.push(value[root]);
    else stack.push(value);
  });

  // perform our query and populate new hash
  var res = q.test(stack, { spec: 'boolean' });
  this.each(function(value, key, index) {
    if (res[index]) hash.set(key, value);
  });

  return hash;
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
    throw new Error('Poorly formed Hash#sortBy');
  }

  this.sort(iterator);
  return this;
};
