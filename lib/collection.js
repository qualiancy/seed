var utils = require('./utils'),
    drip = require('drip');

function Collection (models, options) {
  options = options || {};
  drip.call(this);
  
  // defaults
  this.models = [];
  this._flags = {};
  this._byId = {};
  this._byUuid = {};
  // from options
  this.model = options.model || null;
  
  // starter functions
  this.add(models);
  this.initialize();
}

Collection.extend = utils.extend;

utils.merge(Collection.prototype, drip.prototype);

Collection.prototype.initialize = function() {};

Collection.prototype.flag = function (flag, value) {
  if ('undefined' === typeof value || value === null) {
    return this._flags['_' + flag];
  } else {
    this._flags['_' + flag] = value;
  }
  return;
};

Collection.prototype.add = function (models, opts) {
  var self = this;
  
  if (!Array.isArray(models))
    models = [models];
  
  models.forEach(function(model) {
    model.collection = self;
    self.models.push(model);
    self._byUuid[model.uuid] = model;
    self.emit('add', model);
  });
};

Collection.prototype.remove = function (model, opts) {
  var self = this;
  
  opts = opts || {};
  
  model = this._byUuid[model.uuid];
  
  delete this._byUuid[model.uuid];
  this.models.splice(Array.prototype.indexOf(model), 1);
  if (!opts.silent) this.emit('remove');
  model.collection = null;
};

Collection.prototype.create = function (attributes) {
  if (!this.model) throw new Error('Can\'t create without a model definition');
  var model = new this.model(attributes);
  this.add([model]);
};

module.exports = Collection;