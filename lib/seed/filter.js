var Filter = module.exports = {};

Filter.$gt = function (a, b) {
  return a > b;
};

Filter.$gte = function (a, b) {
  return a >= b;
};

Filter.$lt = function (a, b) {
  return a < b;
};

Filter.$lte = function (a, b) {
  return a <= b;
};

Filter.$all = function (a, b) {
  for (var i = 0; i < b.length; i++) {
    if (!~a.indexOf(b[i])) return false;
  }
  return true;
};

Filter.$exists = function (a, b) {
  return !!a == b;
};

Filter.$mod = function (a, b) {
  return a % b[0] == b[1];
};

Filter.$ne = function (a, b) {
  return a != b;
};

Filter.$in = function (a, b) {
  return ~b.indexOf(a) ? true : false;
};

Filter.$nin = function (a, b) {
  return ~b.indexOf(a) ? false : true;
};

Filter.$size = function (a, b) {
  return (a.length && b) ? a.length == b : false;
};

Filter.$or = function (a) {
  var res = false;
  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (fn) res = true;
  }
  return res;
};

Filter.$nor = function (a) {
  var res = true;
  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (fn) res = false;
  }
  return res;
};

Filter.$and = function (a) {
  var res = true;
  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (!fn) res = false;
  }
  return res;
};