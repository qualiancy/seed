/*!
 * Seed :: Query - MongoDB style array filtering
 * Copyright(c) 2011-2014 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var _ = require('./util');

/**
 * ### filter (query)
 *
 * The primary export is a function that will memoize a query
 * so that it can be used to filter many arrays. Furthermore,
 * there are several methods to adjust the output of the result
 * set.
 *
 * The filter query language is similiar MongoDB's query language
 * in that it allows for nested statements, deep object property
 * detection, and conditionals such as `$and`, `$or`, and `$nor`.
 *
 * ```js
 * var filter = require('gaia-filter');
 *
 * var dataComplex = [
 *     { a: { b: 100 }
 *     , c: 'testC'
 *     , d:
 *       [ { e: 'world' } ]
 *    }
 *  , { a: { b: 50 }
 *    , c: 'testC'
 *    , d:
 *      [ { e: 'universe' }
 *      , { e: 'galaxy' } ]
 *    }
 * ];
 *
 * var query1 = filter({ 'a.b': { $and: [ { $gt: 75 }, { $lt: 125 } ] }});
 *   , query2 = filter({ 'a.b': { $gt: 25, $lt: 75 }, 'd[0].e': { $eq: 'universe' } });
 *
 * var res1 = query1.subset(dataComplex)  // result array will have the first item
 *   , res2 = query1.subset(dataComplex); // result array will have the second item
 * ```
 *
 * Query allows for some flexibility when composing queries by making assumptions
 * based on sane defaults.
 *
 * When a comparator is omitted when comparing a value, it assumes `$eq`.
 *
 * ```js
 * // the following are the same.
 * filter({ hello: { $eq: 'universe' } });
 * filter({ hello: 'universe' });
 * ```
 *
 * When multiple statements are listed, it assumes `$and`.
 *
 * ```js
 * // the following are the same.
 * filter({ $and: [ { hello: { $gt: 42 } }, { hello: { $lt: 84 } } ] });
 * filter({ hello: { $and: [ { $gt: 42 }, { $lt: 84 } ] } });
 * filter({ hello: { $gt: 42, $lt: 84 } });
 * ```
 *
 * @param {Object} query
 * @return filter
 * @api public
 */

var Query = module.exports = function Query(query) {
  if (!(this instanceof Query)) return new Query(query);
  this.query = query;
  this.stack = _.parseQuery(query);
}

Query.prototype = {

  /**
   * ### .test (data)
   *
   * Test a single data point against the query. Will return a
   * boolean indicating whether data passes query criteria.
   *
   * ```js
   * var query = filter({ hello: { $eq: 'universe' }})
   *   , pass = query.test({ hello: 'universe' });
   *
   * pass.should.be.true;
   * ```
   *
   * @param {Mixed} data
   * @return {Boolean} result
   */

  test: function(data, opts) {
    return _.testQuery(data, this.stack);
  },

  /**
   * ### .subset (data)
   *
   * Test an array of data points against the query. Will return
   * an array of all data points that pass the query criteria.
   *
   * ```js
   * var query = { $or : [ { 'hello': true }, { 'universe': true } ] }
   *   , q = filter(query)
   *   , result = q.subset([
   *       { hello: true }
   *     , { universe: false }
   *     , { hello: false, universe: true }
   *     , { hello: false, universe: false }
   *   ]);
   *
   * result.should
   *   .be.an('array')
   *   .and.have.length(2)
   *   .and.deep.equal([
   *       { hello: true }
   *     , { hello: false, universe: true }
   *   ]);
   * ```
   *
   * @param {Array} data
   * @return {Array} result
   */

  subset: function(data) {
    var res = [];
    var datum;

    for (var di = 0; di < data.length; di++) {
      datum = data[di];
      if (_.testQuery(datum, this.stack)) res.push(datum);
    }

    return res;
  },

  /**
   * ### .pass (data)
   *
   * Test an array of data points against the query. Will return
   * an array of boolean in the order of the original array that
   * indicate if the data at that index passed the query criteria.
   *
   * ```js
   * var query = { $or : [ { 'hello': true }, { 'universe': true } ] }
   *   , q = filter(query)
   *   , result = q.pass([
   *         { hello: true }
   *       , { universe: false }
   *       , { hello: false, universe: true }
   *       , { hello: false, universe: false }
   *     ]);
   *
   * result.should
   *   .be.an('array')
   *   .and.have.length(4)
   *   .and.deep.equal([
   *       true
   *     , false
   *     , true
   *     , false
   *   ]);
   * ```
   *
   * @param {Array} data
   * @return {Array} result
   */

  pass: function(data) {
    var res = [];
    var datum;

    for (var di = 0; di < data.length; di++) {
      datum = data[di];
      res.push(_.testQuery(datum, this.stack));
    }

    return res;
  },

  /**
   * ### .index (data)
   *
   * Test an array of data points against the query. Will return
   * an array of numbers indicating the indexes of the original
   * array that passed the query criteria.
   *
   * ```js
   * var query = { $or : [ { 'hello': true }, { 'universe': true } ] }
   *   , q = filter(query)
   *   , result = q.index([
   *         { hello: true }
   *       , { universe: false }
   *       , { hello: false, universe: true }
   *       , { hello: false, universe: false }
   *     ]);
   *
   * result.should
   *   .be.an('array')
   *   .and.have.length(2)
   *   .and.deep.equal([ 0, 2 ]);
   * ```
   *
   * @param {Array} data
   * @return {Array} result
   */

  index: function(data) {
    var res = [];
    var datum;

    for (var di = 0; di < data.length; di++) {
      datum = data[di];
      if (_.testQuery(datum, this.stack)) res.push(di);
    }

    return res;
  }

}
