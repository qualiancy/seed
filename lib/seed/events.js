var Drip = require('drip')
  , util = require('util')
  , _ = require('./utils');

module.exports = EventEmitter;

function EventEmitter() {
  Drip.call(this, { delimeter: ':' });

  switch (arguments.length) {
    case 0:
      this.initialize();
      break;
    case 1:
      this.initialize.call(this, arguments[0]);
      break;
    case 2:
      this.initialize.call(this, arguments[0], arguments[1]);
      break;
    default:
      this.initialize.apply(this, arguments);
      break;
  }
}

EventEmitter.extend = _.extend;

util.inherits(EventEmitter, Drip);

EventEmitter.prototype.initialize = function () {};
