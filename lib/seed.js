/**
 * seed
 */
exports.version = '0.0.3';

var extend = exports.extend = function (obj, extension) {
  var prop;
  for (prop in extension)
    obj[prop] = extension[prop];
  if (extension.toString !== Object.prototype.toString)
    obj.toString = extension.toString;
  return obj;
};

exports.create = function create () {
  var len = arguments.length,
      konstruct = arguments[len - 1];
  
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
  
  if (len > 1) {
    var defaults = {};
    // TODO: this is hackish
    for (var i = len - 2; i>=0; i--) {
      if (arguments[i].prototype) {
        defaults = extend(defaults, arguments[i].prototype);
      } else if ('object' === typeof arguments[i]) {
        defaults = extend(defaults, arguments[i]);
      }
    }

    konstruct = extend(defaults, konstruct);
  }

  var seed;
  if (konstruct.constructor === Object) {
    seed = function() {
      _props(this.constructor.prototype, this);
      
      if (this.initialize && 'function' == typeof this.initialize)
        this.initialize.apply(this, arguments);
    };
  } else {
    seed = konstruct.constructor;
    delete konstruct.constructor;
  }
  seed.prototype = extend(seed.prototype, konstruct);
  return seed;
};