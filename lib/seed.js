var utils = require('./utils');

exports.version = '0.0.3';

exports.utils = utils;

exports.extend = function () {
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
        defaults = utils.extend(defaults, arguments[i].prototype);
      } else if ('object' === typeof arguments[i]) {
        defaults = utils.extend(defaults, arguments[i]);
      }
    }

    konstruct = utils.extend(defaults, konstruct);
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
  seed.prototype = utils.extend(seed.prototype, konstruct);
  return seed;
};