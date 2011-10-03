var utils = require('../utils'),
    drip = require('drip');

function transport () {
  drip.call(this);
  this.initialize();
}

utils.extend(transport.prototype, drip.prototype);

transport.prototype.initialize = function() {
  this.on('create', this.create);
  this.on('read', this.read);
  this.on('update', this.update);
  this.on('delete', this.del);
};

transport.prototype.create = function (data) {
  console.log('create', data);
};

transport.prototype.read = function (data) {
  console.log('read', data);
};

transport.prototype.update = function (data) {
  console.log('update', data);
};

transport.prototype.del = function (data) {
  console.log('delete', data);
};

module.exports = transport;