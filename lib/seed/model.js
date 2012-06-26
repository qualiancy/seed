/*!
 * Seed :: Model
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var inherits = require('super');

/*!
 * Seed component dependancies
 */

var _ = require('./utils')
  , async = require('./base/async')
  , errors = require('./errors/model')
  , EventEmitter = require('./base/events')
  , Hash = require('./base/hash')
  , Query = require('./base/query')
  , Schema = require('./schema')
  , Store = require('./store')
  , uid = new _.Flake();

/*!
 * Module global constants
 */

var noop = function () {};

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

function Model (attributes, opts) {
  // setup
  EventEmitter.call(this);
  opts = opts || {};

  // config
  if (opts.schema) this.schema = opts.schema;
  if (opts.store) this.store = opts.store;
  if (opts.parent) this.parent = opts.parent;
  if (opts.type) this.flag('type', opts.type, true);

  // flags
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
  var args = Array.prototype.slice.call(arguments, 1);
  this.initialize.apply(this, args);
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
 * @returns {Model} model constructor modified
 * @api public
 */

Model.extend = function (type, proto) {
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
  var self = this
    , child = function () { self.apply(this, arguments); };

  inherits.merge([ child, this ]);
  inherits.inherits(child, this);
  if (proto) inherits.merge([ child.prototype, proto ]);
  child.extend = this.extend;
  child.prototype.__type = type;

  // custom initiliaze to pass on flags
  child.prototype.initialize = function () {
    var options = arguments[0] || {};
    if (!options.type) this.flag('type', this.__type, true);
    if (!options.store && opts.store) this.store = opts.store
    if (!options.schema && opts.schema) this.schema = opts.schema;
    delete this.__type;
    if (proto.initialize) proto.initialize.apply(this, arguments);
  };

  return child;
};

/*!
 * Inherit from drip
 */

inherits(Model, EventEmitter);

/*!
 * # initialize
 *
 * noop - Function to be called upon construction.
 */

Model.prototype.initialize = function () {};

/**
 * # attributes (getter)
 */

Object.defineProperty(Model.prototype, 'attributes',
  { get: function () {
      var attrs = this._attributes;
      return attrs;
    }
  , configurable: true
});

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
          schema.paths.set('_id', {
              type: Schema.Type.ObjectId
            , index: true
          });
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
 * # DBRef
 *
 * Helper for standardized DBRef. Based on MongoDB.
 *
 * @api public
 */

Object.defineProperty(Model.prototype, 'DBRef',
  { get: function () {
      return {
          $ref: this.type
        , $id: this.id
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
      if (store) return store;
      var parent = this.flag('parent');
      if (parent) return parent.store;
      return null;
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
  var type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
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
  opts = opts || {};

  if (!opts.force && this.schema) {
    var valid = this.schema.validatePath(path, value);
    if (!valid) return false
  }

  Query.setPathValue(path, value, this._attributes);
  this.flag('dirty', true);
  return true;
};

Model.prototype.merge = function (attrs, opts) {
  opts = opts || {};
  var old_props = _.merge({}, this._attributes)
    , new_props = _.merge(old_props, attrs);

  if (!opts.force && this.schema) {
    var valid = this.schema.validate(new_props);
    if (!valid) return false;
    new_props = this.schema.getValue(new_props, { preserve: true });
  }

  this._attributes = new_props;
  this.flag('dirty', true);
  return true;
};

Model.prototype.validate = function () {
  if (!this.schema) return undefined;
  return this.schema.validate(this._attributes);
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

Model.prototype.save = function (opts, cb) {
  if ('function' === typeof opts) cb = opts, opts = {};
  cb = cb || noop;
  opts = opts || {};

  if (!this.store) return cb(errors.create('no store'));

  if (!opts.force
  && this.schema
  && !this.schema.validate(this._attributes))
    return cb(errors.create('not valid'));

  this.store
    .sync('set', this)
    .then(storeSuccess.call(this, opts, cb), cb);
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

Model.prototype.fetch = function (opts, cb) {
  if (opts && 'function' === typeof opts) cb = opts, opts = {};
  cb = cb || noop;
  opts = opts || {};

  if (!this.store) return cb(errors.create('no store'));

  this.store.sync('get', this)
    .then(storeSuccess.call(this, opts, cb), cb)
};

function storeSuccess (opts, cb) {
  var self = this
    , cache = _.merge({}, this._attributes);

  return function success (data) {
    if (!data) return cb(errors.create('no data'));

    var valid = self.merge(data, {
        silent: (opts.silent || false)
      , force: (opts.force || false)
    });

    if (!valid) return cb(errors.create('not valid'));

    if (self.schema) {
      self.schema.paths.each(function (def, path) {
        if (!def.type) console.log(def);
        if (def.type.name !== 'DBRef') return;
        var prev = Query.getPathValue(path, cache)
          , res = Query.getPathValue(path, self._attributes);
        if (prev instanceof Model
        && prev.type === res.$ref
        && prev.id === res.$id)
          Query.setPathValue(path, prev, self._attributes);
      });
    }

    self.flag('new', false);
    self.flag('dirty', false);
    cb(null);
  }
}

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

Model.prototype.destroy = function (opts, cb) {
  if ('function' === typeof opts) cb = opts, opts = {};
  cb = cb || noop;
  opts = opts || {};

  if (!this.store) return cb(errors.create('no store'));

  var self = this;
  function success () {
    if (self.parent && self.parent.del)
      self.parent.del(self.type, self.id);
    self.flag('destroyed', true);
    self.flag('new', false);
    self.flag('dirty', false);
    cb(null);
  };

  this.store.sync('destroy', this)
    .then(success, cb);
};

Model.prototype.loadRef = function (ref, cb) {
  cb = cb || noop;
  if (!this.store) return cb(errors.create('no store'));
  if (this.get(ref) instanceof Model) return cb(null);

  var self = this
    , vert = this.get(ref);

  if (!vert || !vert.$id || !vert.$ref)
    return cb(errors.create('no dbref'));

  var id = vert.$id
    , type = vert.$ref
    , meta;

  if (type == this.type) {
    meta = this.constructor;
  } else {
    var graph = this.flag('parent');
    meta = graph._models.get(type);
  }

  if (!meta) return cb(errors.create('no type'));

  var opts = graph ? { parent: graph } : {}
    , model = new meta({ _id: id }, opts);

  model.fetch(function (err) {
    if (err) return cb(err);
    self.set(ref, model);
    if (graph) graph.set(model);
    cb(null);
  });
};
