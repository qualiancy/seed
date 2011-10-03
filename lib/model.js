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
  
  var success = function (data) {
    self.set(data, { silent: (opts.silent || false) });
    if (opts.success && 'function' === typeof opts.success) opts.success(self, data);
  };
  
  var error = function (error) {
    // noop (for now);
  };
  
  var oath = this.storage.sync('create', this);
  
  oath.then(success, error);
  
  return oath;
};

model.prototype.fetch = function (opts) {
  
};

model.prototype.destroy = function (opts) {
  var self = this;
  opts = opts || {};
  
  var success = function (data) {
    self.emit('destroy', self);
  };
  
  var error = function (error) {
    // noop (for now);
  };
  
  var oath = this.storage.sync('remove', this);
  
  oath.then(success, error);
  
  return oath;
};

module.exports = model;