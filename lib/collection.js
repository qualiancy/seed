var utils = require('./utils'),
    drip = require('drip');

function collection (models, options) {
  drip.call(this);
  this.models = models;
  this.initialize();
}

collection.extend = utils._extend;

utils.extend(collection.prototype, drip.prototype);

collection.prototype.initialize = function() {};

module.exports = collection;