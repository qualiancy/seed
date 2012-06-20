var exports = module.exports = {};

exports.merge = function (a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

exports.defaults = function (a, b) {
  if (a && b) {
    for (var key in b) {
      if ('undefined' == typeof a[key]) a[key] = b[key];
    }
  }
  return a;
};

// a = target
// b = source
exports.deepMerge = function (a, b) {
  var arr = Array.isArray(b)
    , dest = arr ? [] : {};

  // if source is array
  if (arr) {
    a = a || [];
    dest = dest.concat(a);
    for (var i = 0; i < b.length; i++) {
      var v = b[i];
      if ('object' == typeof v)
        dest[i] = exports.deepMerge(a[i], v);
      else if (!~a.indexOf(v))
        dest.push(v);
    }

  // everything else (objects too)
  } else {
    // if target is and object
    if (a && 'object' === typeof a) {
      var ak = Object.keys(a);
      for (var i = 0; i < ak.length; i++)
        dest[ak[i]] = a[ak[i]];
    }

    var bk = Object.keys(b);
    for (var ii = 0; ii < bk.length; ii++) {
      var k = bk[ii];
      if ('object' !== typeof b[k] || !b[k]) {
        dest[k] = b[k];
      } else {
        if (a && !a[k]) a[k] = Array.isArray(b[k]) ? [] : {};
        dest[k] = exports.deepMerge(a[k], b[k]);
      }
    }
  }

  return dest;
};
