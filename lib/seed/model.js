/*!
 * Seed :: Model
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var util = require('util');

/*!
 * Seed component dependancies
 */

var _ = require('./utils')
  , EventEmitter = require('./events')
  , Hash = require('./hash')
  , Query = require('./query')
  , Schema = require('./schema')
  , SeedError = require('./error')
  , Store = require('./store')
  , uid = new _.Flake();

/*!
 * Module global constants
 */

var emptyFn = function () {};

/*!
 * main export
 */

module.exports = Model;

/**
 * # Model
 *
 * Create a model instance or extend a model definition.
 *
 * @param {Object} attributes to be set on model creation
 * @param {Object} options to influence model behavior
 * @api public
 * @name constructor
 */

function Model (attributes, options) {
  // setup
  EventEmitter.call(this);
  options = options || {};

  // config
  if (options.schema) this.schema = options.schema;
  if (options.store) this.store = options.store;
  if (options.parent) this.parent = options.parent;
  if (options.type) this.flag('type', options.type, true);
  this.flag('new', true, true);
  this.flag('dirty', true, true);

  // default data
  this.uid = uid.gen();
  this._attributes = {};
  this.merge(attributes, {
      silent: true
    , force: true
  });

  // init
  this.initialize();
}

/*!
 * # #toString()
 *
 * Provides a sane toString default.
 */

Model.toString = function () {
  return '[object Model]';
};

/**
 * # Model.extend(type, proto, class)
 *
 * Helper to provide a simple way to extend the prototype
 * of a model.
 *
 * @param {String} type name
 * @param {Object} prototype definition
 * @param {Object} class definition
 * @returns {Model} model constructor modified
 * @api public
 */

Model.extend = function (type, proto, klass) {
  if (!(type && 'string' === typeof type)) {
    klass = proto;
    proto = type;
    type = 'model';
  }

  var opts = {};
  klass = klass || {};
  proto = proto || {};

  if (proto.store) {
    opts.store = proto.store;
    delete proto.store;
  }

  if (proto.schema) {
    opts.schema = proto.schema;
    delete proto.schema;
  }

  // create our child
  var child = _.inherits(this, proto, klass);
  child.extend = this.extend;
  child.prototype.__type = type;

  // custom initiliaze to pass on flags
  child.prototype.initialize = function () {
    var options = arguments[0] || {};
    delete this.__type;
    if (!options.type) this.flag('type', type, true);
    if (!options.store && opts.store) this.flag('store', opts.store, true);
    if (!options.schema && opts.schema) this.flag('schema', opts.schema, true);
    if (proto.initialize) proto.initialize.apply(this, arguments);
  };

  return child;
};

/*!
 * Inherit from drip
 */

util.inherits(Model, EventEmitter);

/*!
 * # initialize
 *
 * noop - Function to be called upon construction.
 */

Model.prototype.initialize = function () {};

/**
 * # id (getter/setter)
 *
 * Sets or gets the current model's `_id`.
 *
 * @param {Integer|String} id
 * @api public
 */

Object.defineProperty(Model.prototype, 'id',
  { get: function () {
      var id = this.get('_id');
      if (!id) id = this.uid;
      return id;
    }
  , set: function (id) {
      this.set('_id', id);
    }
});

/**
 * # type (getter)
 *
 * Gets the flag for the current type.
 *
 * @param {String} type
 * @api public
 */

Object.defineProperty(Model.prototype, 'type',
  { get: function () {
      var type = this.flag('type');
      if ('undefined' === typeof type) {
        type = 'model';
        this.flag('type', type, true);
      }
      return type;
    }
});

/**
 * # schema (getter/setter)
 *
 * Sets or gets the flag for the current schema.
 * Also makes sure that a schema has `_id` as an
 * index upon set.
 *
 * @param {Seed.Schema} schema
 * @api public
 */

Object.defineProperty(Model.prototype, 'schema',
  { get: function () {
      var schema = this.flag('schema');
      return schema;
    }
  , set: function (schema) {
      if (schema instanceof Schema) {
        if (!schema.paths.has('_id')) {
          schema.paths.set('_id', { index: true });
        } else {
          var def = schema.paths.get('_id');
          def.index = true;
          schema.paths.set('_id', def);
        }
        this.flag('schema', schema, true);
      }
    }
});

/**
 * # parent (getter/setter)
 *
 * Sets or gets the flag for the current parent.
 *
 * @param {Object} parent
 * @api public
 */

Object.defineProperty(Model.prototype, 'parent',
  { get: function () {
      var parent = this.flag('parent');
      return parent;
    }
  , set: function (parent) {
      this.flag('parent', parent, true);
    }
});

/**
 * # store (getter/setter)
 *
 * Sets or gets the flag for the current store.
 *
 * @param {Seed.Store} store
 * @api public
 */

Object.defineProperty(Model.prototype, 'store',
  { get: function () {
      var store = this.flag('store');
      return store;
    }
  , set: function (store) {
      if (store instanceof Store)
        this.flag('store', store, true);
    }
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
  var type = (this.type != 'model')
    ? this.type.charAt(0).toUpperCase() + this.type.slice(1)
    : 'ModelItem';
  return '[object ' + type + ']';
};

/**
 * # flag
 *
 * Flags are key:values that represent the models
 * state but are not syncronized with the server.
 *
 * ### Internal Flags
 *
 * - {Boolean} `new`
 * - {Boolaan} `dirty`
 * - {String} `type`
 * - {Seed.Schema} `schema`
 * - {Seed.Store} `store`
 * - {Object} `parent`
 *
 *
 * ### Example
 *
 *        model.flag('key'); // to get a value
 *        model.flag('key', true); // to set a value
 *        model.flag([ 'key1', 'key2' ], 'stringed');
 *
 * @param {String} key
 * @param {Mixed} value
 * @param {Boolean} silent
 * @api public
 * @name .flag()
 */

Model.prototype.flag = function (key, value, silent) {
  silent = ('boolean' === typeof silent) ? silent : false;
  var self = this
    , flags = this._flags || (this._flags = new Hash());

  if (arguments.length === 1) {
    return flags.get(key);
  } else if (arguments.length > 1 && Array.isArray(key)) {
    key.forEach(function (elem) {
      flags.set(elem, value);
      if (!silent) self.emit([ 'flag', elem ], value);
    });
  } else if (arguments.length > 1) {
    flags.set(key, value);
    if (!silent) this.emit([ 'flag', key ], value);
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
  return Query.getPathValue(prop, this._attributes);
};

/**
 * # .has()
 *
 * Returns whether an attribute is defined.
 *
 * @param {String} property path
 * @api public
 */

Model.prototype.has = function (prop) {
  var exist = Query.getPathValue(prop, this._attributes);
  return ('undefined' !== typeof exist) ? true : false;
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

Model.prototype.set = function(path, value, opts) {
  var props = _.merge({}, this._attributes)
    , prev = this.get(path);

  opts = opts || {};

  Query.setPathValue(path, value, props);

  if (!opts.force && this.schema && this.schema instanceof Schema) {
    var valid = this.schema.validatePath(path, value);
    if (!valid) {
      // TODO: possibly emit event?
      return false
    }
  }


  this._attributes = props;
  this.flag('dirty', true);

  if (!opts.silent) {
    this.emit('change', {
        path: path
      , previous: prev
      , currently: value
    });
  }

  return true;
};

Model.prototype.merge = function (attrs, opts) {
  var old_props = _.merge({}, this._attributes)
    , new_props = _.merge(old_props, attrs);

  opts = opts || {};

  if (!opts.force && this.schema && this.cheam instanceof Schema) {
    var valid = this.schema.validate(new_props);
    if (!valid) {
      // TODO: possibly emit event?
      return false;
    }
  }

  this._attributes = new_props;
  this.flag('dirty', true);

  if (!opts.silent) {
    this.emit('change');

    for (var p in attrs) {
      if (this._attributes[p] != new_props[p]) {
        this._attributes[p] = new_props[p];
        this.emit([ 'change', p ], {
          attribute: p,
          previous: old_props[p],
          current: this._attributes[p] });
      }
    }
  }

  return true;
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

  callback = ('function' == typeof callback) ? callback : emptyFn;
  opts = opts || {};

  var success = function (data) {
    var valid = self.merge(data, {
        silent: (opts.silent || false)
      , force: (opts.force || false)
    });

    if (!opts.force && !valid) {
      return callback.call(
          self
        , new SeedError('Attributes not valid', { code: 'ENOTVALID' })
      );
    }

    self.flag('new', false);
    self.flag('dirty', false);

    callback.call(self, null);
  };

  if (store) {
    if (!opts.force && this.schema && !this.schema.validate(this._attributes))
      return callback.call(self, new SeedError('Attributes not valid', { code: 'ENOTVALID' }));

    var sync = store.sync('set', this);
    sync.then(
        success
      , function (ex) { callback.call(self, ex); }
    );
  } else {
    callback.call(self, new SeedError('No storage defined.', { code: 'ENOSTORE' }));
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

  callback = ('function' == typeof callback) ? callback : emptyFn;
  opts = opts || {};

  var success = function (data) {
    // Storage engines should emit this, but just in case.
    if (!data) {
      var err = new SeedError('Model#fetch returned no data', { code: 'ENOTFOUND' });
      return callback.call(self, err);
    }

    var valid = self.merge(data, {
        silent: (opts.silent || false)
      , force: (opts.force || false)
    });

    if (!opts.force && !valid)
      return callback.call(self, new SeedError('Attributes not valid', { code: 'ENOTVALID' }));

    self.flag('new', false);
    self.flag('dirty', false);
    callback.call(self, null);
  };

  var failure = function (err) {
    callback.call(self, err);
  };

  if (store) {
    var sync = store.sync('get', this);
    sync.then(
        success
      , function (ex) { callback.call(self, ex); }
    );
  } else {
    callback.call(self, new SeedError('No storage defined.', { code: 'ENOSTORE' }));
  }
};

/**
 * # .destroy()
 *
 * Delete the model from the storage engine. A `destroy` event will emit and `destroyed`
 * flag will be set on successful completion.  Can execute callback in which the `this` context
 * is the model that was just destroyed.
 *
 * Will remove itself from any graphs it is a part of on `success`.
 *
 * #### Options
 *
 * * **silent** {Boolean} whether to emit `change` events (such as the assign of an id if new)
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

  callback = ('function' == typeof callback) ? callback : emptyFn;
  opts = opts || {};

  var success = function () {
    if (self.parent && self.parent.del)
      self.parent.del(self.type, self.id);

    self.flag('destroyed', true);
    self.flag('new', false);
    self.flag('dirty', false);

    if (!opts.silent) self.emit('destroy', self);
    callback.call(self, null);
  };

  var failure = function (err) {
    callback.call(self, err);
  };

  if (store) {
    var sync = store.sync('destroy', this);
    sync.then(
        success
      , function (ex) { callback.call(self, ex); }
    );
  } else {
    callback.call(self, new SeedError('No storage defined.', { code: 'ENOSTORE' }));
  }
};
