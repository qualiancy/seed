var storage = require('./storage'),
    utils = require('./utils'),
    drip = require('drip');

function model (attributes, options) {
  drip.call(this);
  this._attributes = {};
  this._mid = utils.uid('m');
  this._flags = {};
  
  this.storage = new storage();
  this.set(attributes, { silent: true });
  this.flag('new', true);
  this.flag('changed', false);
  this.initialize();
}

model.extend = utils.extend;

utils.merge(model.prototype, drip.prototype);

model.prototype.initialize = function() {};

model.prototype.serialize = function () {
  return this._attributes;
};

model.prototype.get = function (prop) {
  return this._attributes[prop];
};

model.prototype.set = function (props, opts) {
  opts = opts || {};
  var old_props = utils.merge({}, this._attributes);
  utils.merge(this._attributes, props);
  this.flag('changed', true);
  
  if (!opts.silent) {
    this.emit('change');
    for (var p in props) {
      this.emit('change:' + p, { 
        attribute: p, 
        previous: old_props[p], 
        current: this._attributes[p] });
    }
  }
};

model.prototype.flag = function (flag, value) {
  if (!value) {
    return this._flags['_' + flag];
  } else {
    this._flags['_' + flag] = value;
  }
  return;
};

model.prototype.save = function (opts) {
  var self = this,
      action = (this.flag('new')) ? 'create' : 'update';
  
  opts = opts || {};
  
  var success = function (data) {
    self.set(data, { silent: (opts.silent || false) });
    self.flag('new', false);
    self.flag('changed', false);
  };
  
  var oath = this.storage.sync(action, this);
  oath.then(success);
  return oath;
};

model.prototype.fetch = function (opts) {
  var self = this;
  
  opts = opts || {};
  
  var success = function (data) {
    self.set(data, { silent: (opts.silent || false) });
    self.flag('new', false);
    self.flag('changed', false);
  };
  
  var oath = this.storage.sync('read', this);
  oath.then(success);
  return oath;
};

model.prototype.destroy = function (opts) {
  var self = this;
  opts = opts || {};
  
  var success = function (data) {
    self.emit('destroy', self);
  };
  
  var error = function (error) {};
  
  var oath = this.storage.sync('remove', this);
  oath.then(success, error);
  return oath;
};

module.exports = model;