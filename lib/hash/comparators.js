exports.ASC = function(a, b) {
  return a.value - b.value;
};

exports.DESC = function(a, b) {
  return b.value - a.value;
};

exports.KASC = function(a, b) {
  var A = a.key.toLowerCase()
  var B = b.key.toLowerCase();
  if (A < B) return -1;
  else if (A > B) return 1;
  else return 0;
};

exports.KDESC = function(a, b) {
  var A = a.key.toLowerCase();
  var B = b.key.toLowerCase();
  if (A < B) return 1;
  else if (A > B) return -1;
  else return 0;
};
