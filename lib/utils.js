
exports.merge = function (obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function(source) {
    for (var prop in source) {
      if (source[prop] !== void 0) obj[prop] = source[prop];
    }
  });
  return obj;
};

exports.extend = function (pProps, cProps) {
  var child = exports.inherits(this, pProps, cProps);
  child.extend = this.extend;
  return child;
};

var noop = function () {};
exports.inherits = function (parent, pProps, cProps) {
  var child;
  
  if (pProps && pProps.hasOwnProperty('constructor')) {
    child = pProps.constructor;
  } else {
    child = function () { return parent.apply(this, arguments); };
  }
  
  exports.merge(child, parent);
  
  noop.prototype = parent.prototype;
  child.prototype = new noop();
  
  if (pProps) exports.merge(child.prototype, pProps);
  if (cProps) exports.merge(child, cProps);
  
  child.prototype.constructor = child;
  
  return child;
};

var uidCount = 0;
var uid = exports.uid = function (prefix) {
  var id = uidCount++;
  return prefix ? prefix + id : id;
};