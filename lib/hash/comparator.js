var Comparator = module.exports  = {};


Comparator.ASC = function (a, b) {
  return a.value - b.value;
};

Comparator.DESC = function (a, b) {
  return b.value - a.value;
};