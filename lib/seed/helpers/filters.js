var filter = module.exports = {};

filter.$gt = function (a, b) {
  return a > b;
};

filter.$gte = function (a, b) {
  return a >= b;
};

filter.$lt = function (a, b) {
  return a < b;
};

filter.$lte = function (a, b) {
  return a <= b;
};

filter.$all = function (a, b) {
  for (var i = 0; i < b.length; i++) {
    if (!~a.indexOf(b[i])) return false;
  }
  return true;
};

filter.$exists = function (a, b) {
  return !!a == b;
};

filter.$mod = function (a, b) {
  return a % b[0] == b[1];
};

filter.$eq = function (a, b) {
  return a == b;
};

filter.$ne = function (a, b) {
  return a != b;
};

filter.$in = function (a, b) {
  return ~b.indexOf(a) ? true : false;
};

filter.$nin = function (a, b) {
  return ~b.indexOf(a) ? false : true;
};

filter.$size = function (a, b) {
  return (a.length && b) ? a.length == b : false;
};

filter.$or = function (a) {
  var res = false;
  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (fn) res = true;
  }
  return res;
};

filter.$nor = function (a) {
  var res = true;
  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (fn) res = false;
  }
  return res;
};

filter.$and = function (a) {
  var res = true;
  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (!fn) res = false;
  }
  return res;
};