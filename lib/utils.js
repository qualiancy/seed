
exports.extend = function (obj, extension) {
  var prop;
  for (prop in extension)
    obj[prop] = extension[prop];
  if (extension.toString !== Object.prototype.toString)
    obj.toString = extension.toString;
  return obj;
};