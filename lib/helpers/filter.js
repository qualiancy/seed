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
  for (var i in b) {
    if (!~a.indexOf(b[i])) return false;
  }
  return true;
};

Filter.$exists = function (a, b) {
  return !!a == b;
};