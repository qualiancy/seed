
exports.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

exports.extend = function (proto, klass) {
  var child = exports.inherits(this, proto, klass);
  child.extend = this.extend;
  return child;
};

exports.inherits = function (parent, proto, klass) {
  var child, 
      noop = function () {};
  
  if (proto && proto.hasOwnProperty('constructor')) {
    child = proto.constructor;
  } else {
    child = function () { return parent.apply(this, arguments); };
  }
  
  exports.merge(child, parent);
  noop.prototype = parent.prototype;
  child.prototype = new noop();
  
  if (proto) exports.merge(child.prototype, proto);
  if (klass) exports.merge(child, klass);
  child.prototype.constructor = child;
  
  return child;
};

exports.uid = function () {
  this.counter = 0;
  this.mOld = 0;
};

uid.prototype.gen = function () {
  var protect = false;
  var m = new Date().getTime() - 1262304000000;
  if (this.mOld >= m) {
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

exports.isFunction = function(fn) {
  return fn && 'function' === typeof fn;
};

