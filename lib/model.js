// TDDO: Sync related events should not return oath. Convert back to callback.
// TODO: If attrs includes id, assidgn model.id, and visa versa

var drip = require('drip');

var storage = require('./storage'),
    utils = require('./utils');

var fiz = new utils.uuid();

function Model (attributes, options) {
  drip.call(this);
  this.id = null;
  this.uuid = fiz.gen();
  this._attributes = {};
  this._flags = {};
  
  this.collection = {};
  this.storage = new storage();
  this.set(attributes, { silent: true });
  this.flag('new', true);
  this.flag('changed', false);
  this.initialize();
}

Model.extend = utils.extend;

utils.merge(Model.prototype, drip.prototype);

Model.prototype.initialize = function() {};

Model.prototype.flag = function (flag, value) {
  if ('undefined' === typeof value || value === null) {
    return this._flags['_' + flag];
  } else {
    this._flags['_' + flag] = value;
  }
  return;
};

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
  this.flag('changed', (opts.silence) ? false : true);
  
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

Model.prototype.save = function (opts, callback) {
  var self = this,
      action = (this.flag('new')) ? 'create' : 'update';
  
  if (opts && utils.isFunction(opts))
    callback = opts;
  opts = opts || {};
  
  var success = function (data) {
    self.set(data, { silent: (opts.silent || false) });
    self.id = data.id;
    self.flag('new', false);
    self.flag('changed', false);
    
    if (utils.isFunction(callback)) callback.call(self, null);
  };
  
  var failure = function (err) {
    if (utils.isFunction(callback)) callback.call(self, err);
  };
  
  var oath = this.storage.sync(action, this);
  oath.then(success, failure);
};

Model.prototype.fetch = function (opts, callback) {
  var self = this;
  
  if (opts && utils.isFunction(opts))
    callback = opts;
  opts = opts || {};
  
  var success = function (data) {
    self.set(data, { silent: (opts.silent || false) });
    self.id = data.id;
    self.flag('new', false);
    self.flag('changed', false);
    
    if (utils.isFunction(callback)) callback.call(self, null);
  };
  
  var failure = function (err) {
    if (utils.isFunction(callback)) callback.call(self, err);
  };
  
  var oath = this.storage.sync('read', this);
  oath.then(success, failure);
};

Model.prototype.destroy = function (opts, callback) {
  var self = this;
  
  if (opts && utils.isFunction(opts))
    callback = opts;
  opts = opts || {};
  
  var success = function (data) {
    self.emit('destroy', self);
    if (utils.isFunction(callback)) callback.call(self, null);
  };
  
  var failure = function (err) {
    if (utils.isFunction(callback)) callback.call(self, err);
  };
  
  var oath = this.storage.sync('remove', this);
  oath.then(success, failure);
};

module.exports = Model;