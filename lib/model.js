var utils = require('./utils'),
    drip = require('drip');

function model (attributes, options) {
  drip.call(this);
  this.attributes = attributes;
  this.initialize();
}

model.extend = utils._extend;

utils.extend(model.prototype, drip.prototype);

model.prototype.initialize = function() {};

module.exports = model;