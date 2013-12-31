/*!
 * Seed :: Query (utils) - MongoDB style array filtering
 * Copyright(c) 2011-2014 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

var pathval = require('pathval');
var type = require('type-detect').Library();

var comparators = require('./comparators');

/*!
 * Custom type
 */

type.define('simplex', function(o) {
  if ('string' === type.of(o)) return true;
  if ('number' === type.of(o)) return true;
  if ('boolean' === type.of(o)) return true;
  return false;
})

/*!
 * Given the query input, create a re-usable definition
 * for how to test data again the query.
 *
 * @param {Object} query
 * @returns {Array} stack to be used with `Filtr.prototype.test`
 */

exports.parse = function(query) {
  var stack = [];
  var params, qry;

  for (var cmd in query) {
    params = query[cmd];
    qry = {};

    if (cmd[0] == '$') {
      qry.test = exports.parseFilter(query);
    } else if (type.test(params, 'simplex')) {
      qry.test = exports.parseFilter({ $eq: params });
      qry.path = cmd;
    } else {
      qry.test = exports.parseFilter(params);
      qry.path = cmd;
    }

    stack.push(qry);
  }

  return stack;
}

/*!
 * Given that the root object passed is a comparator definition,
 * return a consumable test definition.
 *
 * @param {Object} query
 * @returns {Array} stack for use as input with `testFilter`
 */

exports.parseFilter = function(query) {
  var stack = [];

  for (var test in query) {
    var fn = comparators[test];
    var params = query[test];
    var traverse = false;
    var st = [];
    var p, nq;

    if (1 === test.length) {
      traverse = true;
      for (var i = 0; i < params.length; i++) {
        p = params[i];
        if (type.test(p, 'simplex')) traverse = false;
        else nq = exports.parseQuery(p);
        st.push(nq);
      }
    }

    stack.push({
      fn: fn,
      params: traverse ? st : params,
      traverse: traverse
    });
  }

  return stack;
}

/*!
 * Given a well-formed stack from `parseFilter`, test
 * a given value again the stack.
 *
 * As the value is passed to a comparator, if that comparator
 * cannot interpret the value, false will be return. IE $gt: 'hello'
 *
 * @param {Object} value for consumption by comparator test
 * @param {Array} stack from `parseFilter`
 * @return {Boolean} result
 * @api private
 */

exports.testFilter = function(val, stack) {
  var pass = true;

  for (var si = 0, sl = stack.length; si < sl; si++) {
    var filter = stack[si];
    var el = filter.path ? pathval.get(val, filter.path) : val
    var res = testFilter(el, filter.test);
    if (!res) pass = false;
  }

  return pass;
}

/*!
 * Proxy the testing to the comparator or back to `testFilter`
 * if we traversing.
 *
 * @param {Mixed} value to test
 * @param {Array} stack to iterate
 * @return {Boolean} result
 * @api private
 */

function testFilter(val, stack) {
  var res = true;

  for (var i = 0; i < stack.length; i++) {
    var test = stack[i];
    var params = test.params;
    var p = [];

    if (test.traverse) {
      for (var ii = 0; ii < params.length; ii++) {
        var tres = exports.testFilter(val, params[ii]);
        p.push(tres);
      }

      params = p;
    }

    if (test.fn.length === 1 && !test.fn(params)) res = false;
    else if (test.fn.length > 1 && !test.fn(val, params)) res = false;
  }

  return res;
}
