var storage = require('./storage'),
    utils = require('./utils'),
    drip = require('drip');

function model (attributes, options) {
  drip.call(this);
  this.attributes = {};
  this.set(attributes, { silent: true });
  this.storage = new storage();
  this._mid = utils.uid('m');
  this.initialize();
}

model.extend = utils._extend;

utils.extend(model.prototype, drip.prototype);

model.prototype.initialize = function() {};

model.prototype.serialize = function () {
  return this.attributes;
};

model.prototype.get = function (prop) {
  return this.attributes[prop];
};

model.prototype.set = function (props, opts) {
  opts = opts || {};
  var old_props = utils.extend({}, this.attributes);
  utils.extend(this.attributes, props);
  
  if (!opts.silent) {
    this.emit('change');
    for (var p in props) {
      this.emit('change:' + p, { 
        attribute: p, 
        previous: old_props[p], 
        current: this.attributes[p] });
    }
  }
};

model.prototype.save = function (opts) {
  var self = this;
  opts = opts || {};
  
  this.storage.sync('create', this, function (err, data) {
    if (err) throw new Error(err);
    self.set(data, { silent: (opts.silent || false) });
  });
};

model.prototype.fetch = function (opts) {
  
};

model.prototype.remove = function (opts) {
  
};

module.exports = model;