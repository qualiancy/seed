/*!
 * Seed :: Query (comparators) - MongoDB style array filtering
 * Copyright(c) 2011-2014 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * ##### $gt (a, b)
 *
 * Assert `a` is greater than `b`.
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @api public
 */

exports['$gt'] = function(a, b) {
  return a > b;
}

/**
 * ##### $gte (a, b)
 *
 * Assert `a` is greater than or equal to `b`.
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @api public
 */

exports['$gte'] = function (a, b) {
  return a >= b;
}

/**
 * ##### $lt (a, b)
 *
 * Assert `a` is less than `b`.
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @api public
 */

exports['$lt'] = function(a, b) {
  return a < b;
}

/**
 * ##### $lte (a, b)
 *
 * Assert `a` is less than or equal to `b`.
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @api public
 */

exports['$lte'] = function(a, b) {
  return a <= b;
}

/**
 * ##### $all (a, b)
 *
 * Assert `a` contains at least all items in `b`.
 *
 * @param {Array} a
 * @param {Array} b
 * @return {Boolean}
 * @api public
 */

exports['$all'] = function(a, b) {
  for (var i = 0; i < b.length; i++) {
    if (!~a.indexOf(b[i])) return false;
  }

  return true;
}

/**
 * ##### $exists (a, b)
 *
 * Assert truthiness of `a` equals `b`.
 *
 * @param {Mixed} a
 * @param {Boolean} b
 * @return {Boolean}
 * @api public
 */

exports['$exists'] = function(a, b) {
  return !!a == b;
}

/**
 * ##### $mod (a, b)
 *
 * Assert `a` mod (`%`) `b[0]` equals `b[1]`.
 *
 * @param {Number} a
 * @param {Array} b
 * @return {Boolean}
 * @api public
 */

exports['$mod'] = function(a, b) {
  return a % b[0] == b[1];
}

/**
 * ##### $eq (a, b)
 *
 * Assert `a` equals (`===`) `b`.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean}
 * @api public
 */

exports['$eq'] = function(a, b) {
  return a === b;
}

/**
 * ##### $eq (a, b)
 *
 * Assert `a` does not equal (`!==`) `b`.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean}
 * @api public
 */

exports['$ne'] = function(a, b) {
  return a !== b;
}

/**
 * ##### $in (a, b)
 *
 * Assert `a` is in `b` using `indexOf`.
 *
 * @param {Mixed} a
 * @param {Array} b
 * @return {Boolean}
 * @api public
 */

exports['$in'] = function(a, b) {
  return ~b.indexOf(a) ? true : false;
}

/**
 * ##### $nin (a, b)
 *
 * Assert `a` is not in `b` using `indexOf`.
 *
 * @param {Mixed} a
 * @param {Array} b
 * @return {Boolean}
 * @api public
 */

exports['$nin'] = function(a, b) {
  return ~b.indexOf(a) ? false : true;
}

/**
 * ##### $size (a, b)
 *
 * Assert `a` has length of `b`. Returns
 * `false` if `a` does not have a length.
 * property.
 *
 * @param {Mixed} a
 * @param {Number} b
 * @return {Boolean}
 * @api public
 */

exports['$size'] = function(a, b) {
  return (a && a.length && b) ? a.length == b : false;
}

/**
 * ##### $or (a)
 *
 * Assert `a` has at least one truthy value.
 *
 * @param {Array} a
 * @return {Boolean}
 * @api public
 */

exports['$or'] = function(a) {
  var res = false;

  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (fn) res = true;
  }

  return res;
}

/**
 * ##### $nor (a)
 *
 * Assert `a` has zero truthy values.
 *
 * @param {Array} a
 * @return {Boolean}
 * @api public
 */

exports['$nor'] = function(a) {
  var res = true;

  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (fn) res = false;
  }

  return res;
}

/**
 * ##### $and (a)
 *
 * Assert `a` has all truthy values.
 *
 * @param {Array} a
 * @return {Boolean}
 * @api public
 */

exports['$and'] = function(a) {
  var res = true;

  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (!fn) res = false;
  }

  return res;
}
