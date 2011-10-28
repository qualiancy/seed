var tea = require('tea'),
    drip = require('drip');

function Collection (models, options) {
  options = options || {};
  drip.call(this);
  
  // defaults
  this._models = [];
  this._byID = {};
  this._byUID = {};
  this._flags = {};
  
  // from options
  this.model = options.model || this.model || null;
  this.store = options.store || this.store || null;
  this.path = options.path || this.path || null;
  
  // getters
  this.__defineGetter__('count', function () {
    return this._models.length;
  });
  
  // starter functions
  if (models && models.length)
    this.add(models);
  this.initialize();
}

Collection.extend = tea.extend;
tea.merge(Collection.prototype, drip.prototype);

Collection.prototype.initialize = function() {};

Collection.prototype.flag = function (flag, value) {
  if ('undefined' === typeof value || value === null) {
    return this._flags['_' + flag];
  } else {
    this._flags['_' + flag] = value;
  }
  return this;
};

Collection.prototype.each = function (iterator) {
  this._models.forEach(function (model) {
    iterator.call(null, model);
  });
};

Collection.prototype.add = function (models, opts) {
  var self = this;
  
  if (!Array.isArray(models))
    models = [models];
    
  models.forEach(function(model) {
    model.collection = self;
    if (!self._byID[model.id] && !self._byUID[model.uid])
      self._models.push(model);
    self.emit('add', model);
  });
  
  this._refreshLookups();
  
  return this;
};

Collection.prototype._refreshLookups = function () {
  var self = this;
  
  this._byID = {};
  this._byUID = {};
  
  this.each(function (model) {
    if (model.id)
      self._byID[model.id] = model;
    self._byUID[model.uid] = model;
  });
};

Collection.prototype.get = function (id, callback) {
  // TODO!!
};

Collection.prototype.create = function (attributes) {
  if (!this.model) throw new Error('Can\'t create without a model definition');
  var model = new this.model(attributes);
  this.add([model]);
};

Collection.prototype.remove = function (model, opts) {
  var self = this;
  
  opts = opts || {};
  
  model = this._byUuid[model.uuid];
  
  delete this._byUuid[model.uuid];
  this.models.splice(Array.prototype.indexOf(model), 1);
  if (!opts.silent) this.emit('remove');
  model.collection = null;
  
  return this;
};

Collection.prototype.push = function (opts, callback) {
  if (!this.path) throw new Error('Can\'t push without a path definition');
  
  var self = this
    , count = 0
    , ret_err = null;
  
  if (opts && tea.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  
  if (!tea.isFunction(callback))
    callback = function () {};
  
  opts = opts || {};
  
  var after = function (err) {
    count++;
    if (err && ret_err === null)
      ret_err = err;
    if (count == self.count) {
      self._refreshLookups();
      callback.call(self, ret_err);
    }
  };
  
  this.each(function (model) {
    model.save.call(model, opts, after);
  });
};

Collection.prototype.pull = function (opts, callback) {
  if (!this.path) throw new Error('Can\'t push without a path definition');
  
  var self = this
    , count = 0
    , ret_err = null;
  
  if (opts && tea.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  
  if (!tea.isFunction(callback))
    callback = function () {};
  
  opts = opts || {};
  
  var after = function (err) {
    count++;
    if (err && ret_err === null)
      ret_err = err;
    if (count == self.count) {
      self._refreshLookups();
      callback.call(self, ret_err);
    }
  };
  
  this.each(function (model) {
    model.fetch.call(model, opts, after);
  });
};

Collection.prototype.fetch = function (opts, callback) {
  if (!this.model) throw new Error('Can\'t fetch without a model definition');
  if (!this.path) throw new Error('Can\'t fetch without a path definition');
  
  var self = this
    , store = this.store;
  
  if (opts && tea.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  
  if (!tea.isFunction(callback))
    callback = function () {};
  
  opts = opts || {};
  
  var success = function (data) {
    data.forEach(function(attrs) {
      self.create(attrs);
    });
    callback.call(self, null);
  };
  
  var failure = function (err) {
    callback.call(self, err);
  };
  
  var sync = store.sync('fetch', this);
  sync.then(success, failure);
};

module.exports = Collection;