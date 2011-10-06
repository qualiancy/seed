/*!
 * seed - model constructor / prototype
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var drip = require('drip'),
    oath = require('oath');

var MemoryStore = require('./storage/memory'),
    utils = require('./utils');

var chain = require('./model/chain');

var fiz = new utils.uid();

var store = new MemoryStore();

/**
 * # Model
 * 
 * Create a model instance or extend a model definition.
 * 
 * @param {Object} attributes to be set on model creation
 * @param {Object} options to influence model behavior
 * @api public
 */

function Model (attributes, options) {
  drip.call(this);
  this.id = null;
  this.uuid = fiz.gen();
  this._attributes = {};
  this._flags = {};
  
  this.collection = {};
  this.store = store;
  this.set(attributes, { silent: true });
  this.flag('new', true);
  this.flag('changed', false);
  this.initialize();
}

Model.extend = utils.extend;
utils.merge(Model.prototype, drip.prototype);

/**
 * # initialize
 * 
 * noop - Function to be called upon instanciation.
 */

Model.prototype.initialize = function () {};

/**
 * # flag
 * 
 * Flags are key:values that represent the models 
 * state but are not syncronized with the server.
 * 
 * Avoid using internal flags: `new`, `changed`
 * 
 *        model.flag('key'); // to get a value
 *        model.flag('key', true); // to set a value
 * 
 * @param {String} key
 * @param {Boolean|String|Object} value
 * @api public
 */

Model.prototype.flag = function (key, value) {
  if ('undefined' === typeof value || value === null) {
    return this._flags['_' + key];
  } else {
    this._flags['_' + key] = value;
  }
  return;
};

/**
 * # serialize
 * 
 * Get a string of json representing the model attributes.
 * 
 * @api public
 */

Model.prototype.serialize = function () {
  return JSON.stringify(this._attributes);
};

/**
 * # .get()
 * 
 * Return the value of an attribute.
 * 
 * @param {String} property
 * @api public
 */

Model.prototype.get = function (prop) {
  return this._attributes[prop];
};

/**
 * # .set()
 * 
 * Set the value of a set of attributes. Attributes 
 * will be merged with existing attributes.
 * 
 * #### Options
 * 
 * * _silent_ {Boolean} whether to emit `change` events
 * 
 * @param {Object} attributes
 * @param {Object} options
 * @api public
 */

Model.prototype.set = function (props, opts) {
  // TODO: Change props to attrs
  opts = opts || {};
  var old_props = utils.merge({}, this._attributes);
  utils.merge(this._attributes, props);
  if (this._attributes.id) this.id = this._attributes.id;
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
};

/**
 * # .save()
 * 
 * Save the current attributes of the model to the 
 * storage engine. Can execute a `callback` on completion. 
 * The `this` context will be the model that was just saved.
 * 
 * 
 * #### Options
 * 
 * * _silent_ {Boolean} emit change events
 * 
 * @param {Object} options
 * @param {Function} callback to be executed on compltion
 * @api public
 */

Model.prototype.save = function (opts, callback) {
  var self = this
    , store = this.collection.store || this.store || null;
  
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
  
  if (store) {
    var sync = store.sync('set', this);
    sync.then(success, failure);
  } else {
    failure({ code: 4, message: 'no storage defined' });
  }
};

/**
 * # .fetch()
 * 
 * Get the current model state from the storage engine. Requires that an id is assigned
 * as an attribute to lookup. Can execute `callback` on completions. The `this` context 
 * will be the model that was just fetched.
 * 
 * #### Options
 * 
 * * _silent_ {Boolean} whether to emit `change` events (such as the assign of an id if new)
 * 
 * @param {Object} options
 * @param {Function} callback to be executed on compltion
 * @api public
 */

Model.prototype.fetch = function (opts, callback) {
  var self = this
    , store = this.collection.store || this.store || null;
  
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
  
  if (store) {
    var sync = store.sync('get', this);
    sync.then(success, failure);
  } else {
    failure({ code: 4, message: 'no storage defined' });
  }
};

/**
 * # .destroy()
 * 
 * Delete the model from the storage engine. A `destroy` event will emit and `destroyed` 
 * flag will be set on successful completion.  Can execute callback in which the `this` context
 * is the model that was just destroyed.
 * 
 * Will remove itself from any collections it is a part of on `success`.
 * 
 * #### Options
 * 
 * * _silent_ {Boolean} whether to emit `change` events (such as the assign of an id if new)
 * 
 * @param {Object} options
 * @param {Function} callback to be executed on compltion
 * @api public
 */

Model.prototype.destroy = function (opts, callback) {
  var self = this
    , store = this.collection.store || this.store || null;
  
  if (opts && utils.isFunction(opts))
    callback = opts;
  opts = opts || {};
  
  var success = function (data) {
    if (self.collection.remove) self.collection.remove(data);
    if (!opts.silent) {
      self.emit('destroy', self);
      self.flag('destroyed', true);
    }
    if (utils.isFunction(callback)) callback.call(self, null);
  };
  
  var failure = function (err) {
    if (utils.isFunction(callback)) callback.call(self, err);
  };
  
  if (store) {
    var sync = store.sync('destroy', this);
    sync.then(success, failure);
  } else {
    failure({ code: 4, message: 'no storage defined' });
  }
};

/**
 * # .chain()
 * 
 * Chains allow an alternative api in which to interact with model instances. Instead of
 * using callbacks, operations queued up then executed. See `lib/model/chain/js`.
 * 
 * #### Example
 * 
 *      model.chain()
 *        .set({key: 'value'})
 *        .save(successFn, failureFn)
 *          .then(doSomething)
 *          .get('key')
 *            .then(workWithKeyValue)
 *            .pop()
 *          .pop()
 *        .exec();
 * 
 * @api public
 * @see lib/model/chain.js
 */

Model.prototype.chain = function () {
  return new chain(this);
};

/*!
 * main export
 */
module.exports = Model;