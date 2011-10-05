
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

var uuid = exports.uuid = function () {
  this.counter = 0;
  this.mOld = 0;
};

exports.isFunction = function(fn) {
  return fn && 'function' === typeof fn;
};

uuid.prototype.gen = function () {
  var protect = false;
  var m = new Date().getTime() - 1262304000000;
  if (this.mOld == m) {
    this.counter++;
    if (this.counter == 4095) {
      protect = true;
      this.counter = 0;
      setTimeout(function() {
        arguments.callee;
      }, 1);
    }
  } else {
    this.mOld = m;
    this.counter = 0;
  }
  if (protect === false) {
    m = m * Math.pow(2, 12);
    var uid = m + this.counter;
    return uid;
  }
};

