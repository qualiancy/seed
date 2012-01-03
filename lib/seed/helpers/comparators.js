var comparator = module.exports  = {};

comparator.ASC = function (a, b) {
  return a.value - b.value;
};

comparator.DESC = function (a, b) {
  return b.value - a.value;
};