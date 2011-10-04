var drip = require('drip');

var storage = require('./storage'),
    utils = require('./utils');

function Model (attributes, options) {
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

Model.extend = utils.extend;

utils.merge(Model.prototype, drip.prototype);

Model.prototype.initialize = function() {};

Model.prototype.serialize = function () {
  return this._attributes;
};

Model.prototype.get = function (prop) {
  return this._attributes[prop];
};

Model.prototype.set = function (props, opts) {
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
  return this;
};

Model.prototype.flag = function (flag, value) {
  if ('undefined' === typeof value || value === null) {
    return this._flags['_' + flag];
  } else {
    this._flags['_' + flag] = value;
  }
  return;
};

Model.prototype.save = function (opts) {
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

Model.prototype.fetch = function (opts) {
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

Model.prototype.destroy = function (opts) {
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

module.exports = Model;