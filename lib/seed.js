
exports.version = '0.0.1';

exports.extend = function () {
  var len = arguments.length,
      konstruct = arguments[len - 1];
  
  if (konstruct.constructor !== Object)
    throw new Error('Constructor must be of type `object`: ' + konstruct);
  
  var _props = function (from, to) {
    for (var m in from) {
      Object.defineProperty(to, m, {
        value: from[m],
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  };

  var _extend = function (obj, extension) {
    var prop;
    for (prop in extension)
      obj[prop] = extension[prop];
    if (extension.toString !== Object.prototype.toString)
      obj.toString = extension.toString;
  };
  
  if (len > 1) {
    var defaults = {};
    // TODO: this is hackish
    for (var i = len - 2; i>=0; i--) {
      if (arguments[i].prototype) {
        _extend(defaults, arguments[i].prototype);
      } else if ('object' === typeof arguments[i]) {
        _extend(defaults, arguments[i]);
      }
    }
    
    _extend(defaults, konstruct);
    konstruct = defaults;
  }

  var seed = function() {
    _props(this.constructor.prototype, this);
    
    if (this.initialize && 'function' == typeof this.initialize)
      this.initialize.apply(this, arguments);
  };
  
  _extend(seed.prototype, konstruct);
  return seed;
};