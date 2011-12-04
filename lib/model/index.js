/*!
 * seed - model constructor / prototype
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var util = require('util')
  , drip = require('drip');

var utils = require('../utils')
  , Hash = require('../hash')

var chain = require('./chain');

var uid = new utils.Flake();

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
  options = options || {};

  drip.call(this);

  this.uid = uid.gen();
  this._flags = new Hash();
  this._attributes = {};

  this.type = options.type || this.type || 'model';
  this.store = options.store || this.store || null;
  this.parent = options.parent || this.parent || {};

  this.set(attributes, { silent: true });

  this.flag([ 'new', 'dirty' ], true);
  this.flag('changed', false);

  this.initialize();
}

Model.toString = function () {
  return '[object Model]';
};

Model.extend = function (type, proto, klass) {
  if (!(type && 'string' === typeof type)) {
    klass = proto;
    proto = type;
    type = 'model';
  }

  klass = klass || {};
  klass.type = type;

  proto = proto || {};
  proto.type = type;

  var child = utils.inherits(this, proto, klass);
  child.extend = this.extend;
  return child;
};

util.inherits(Model, drip);

/*!
 * # initialize
 *
 * noop - Function to be called upon instanciation.
 */

Model.prototype.initialize = function () {};

/**
 * # id (getter)
 *
 * returns the id of the current model item
 *
 * @api public
 */

Model.prototype.__defineGetter__('id', function () {
  return this.get('id');
});

/**
 * # id (setter)
 *
 * shortcut to set the id of the current model id
 *
 * @param {Integer|String} id
 * @api public
 */

Model.prototype.__defineSetter__('id', function (id) {
  this.set({ 'id': id });
});

/**
 * # toString
 *
 * returns a javascript string describing the
 * current model object
 *
 * @api public
 */

Model.prototype.toString = function () {
  var type = this.type || 'ModelItem';
  return '[object ' + type + ']';
};

/**
 * # flag
 *
 * Flags are key:values that represent the models
 * state but are not syncronized with the server.
 *
 * Avoid using internal flags: `new`, `changed`, `dirty`.
 *
 *        model.flag('key'); // to get a value
 *        model.flag('key', true); // to set a value
 *
 * @param {String} key
 * @param {Boolean|String|Object} value
 * @api public
 */

Model.prototype.flag = function (key, value) {
  if ('undefined' === typeof value || null === value) {
    return this._flags.get(key);
  } else {
    if (!Array.isArray(key)) key = [ key ];

    key.forEach(function (elem) {
      this._flags.set(elem, value);
      this.emit('flag:' + elem, value);
    }, this);

    return value;
  }
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

Model.prototype.set = function (attrs, opts) {
  var old_props = utils.merge({}, this._attributes)
    , new_props = utils.merge(this._attributes, attrs);

  opts = opts || {};

  this.flag([ 'changed', 'dirty' ], true);

  if (!opts.silent) {
    this.emit('change');
    this.emit('dirty');

    for (var p in attrs) {
      if (this._attributes[p] != new_props[p]) {
        this._attributes[p] = new_props[p];
        this.emit('change:' + p, {
          attribute: p,
          previous: old_props[p],
          current: this._attributes[p] });
      }
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
    , store = this.store || this.parent.store || null;

  if (opts && 'function' === typeof opts) {
    callback = opts;
    opts = {};
  }

  if (!callback || 'function' !== typeof callback) {
    callback = function () {};
  }

  opts = opts || {};

  var success = function (data) {
    self.set(data, { silent: (opts.silent || false) });
    self.id = data.id;
    self.flag([ 'new', 'changed', 'dirty' ], false);

    callback.call(self, null);
  };

  var failure = function (err) {
    callback.call(self, err);
  };

  if (store) {
    var sync = store.sync('set', this);
    sync.then(success, failure);
  } else {
    failure({
      code: 4,
      message: 'no storage defined'
    });
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
    , store = this.store || this.parent.store || null;

  if (opts && 'function' === typeof opts) {
    callback = opts;
    opts = {};
  }

  if (!callback || 'function' !== typeof callback) {
    callback = function () {};
  }

  opts = opts || {};

  var success = function (data) {
    self.set(data, { silent: (opts.silent || false) });
    self.id = data.id;

    self.flag([ 'new', 'changed', 'dirty' ], false);

    callback.call(self, null);
  };

  var failure = function (err) {
    callback.call(self, err);
  };

  if (store) {
    var sync = store.sync('get', this);
    sync.then(success, failure);
  } else {
    failure({
      code: 4,
      message: 'no storage defined'
    });
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
    , store = this.store || this.parent.store || null;

  if (opts && 'function' === typeof opts) {
    callback = opts;
    opts = {};
  }

  if (!callback || 'function' !== typeof callback) {
    callback = function () {};
  }

  opts = opts || {};

  var success = function (data) {
    if (self.parent.del)
      self.parent.del('/' + self.type + '/' + self.id);

    // TODO: Missing flags?
    self.flag('destroyed', true);

    if (!opts.silent) {
      self.emit('destroy', self);
      self.emit('destroy:' + self.id, self);
    }

    callback.call(self, null);
  };

  var failure = function (err) {
    callback.call(self, err);
  };

  if (store) {
    store.sync('destroy', this)
      .then(success, failure);
  } else {
    failure({
      code: 4,
      message: 'no storage defined'
    });
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
 *      model
 *        .chain()
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