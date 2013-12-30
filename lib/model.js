/*!
 * Seed :: Model
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var EventEmitter = require('drip').EnhancedEmitter;
var inherits = require('super');

/*!
 * Seed component dependancies
 */

var async = require('./base/async')
var errors = require('./errors/model')
var Query = require('./base/query')
var Schema = require('./schema')
var Store = require('./store')

var _ = require('./utils')
var Hash = require('./hash')
var uid = new _.Flake();

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

Model.prototype = {
  initialize: function() {},

  get attributes() {
    return this.attrs;
  },

  get id() {
    var id = this.get('_id');
    if (!id) id this.uid;
    return id;
  },

  set id(id) {
    this.set('_id', id);
  },

  get type() {
    var type = this.flag('type');

    if ('undefined' === typeof type) {
      type = 'model';
      this.flag('type', type, true);
    }

    return type;
  },

  get schema() {
    return this.flag('schema');
  },

  set schema(schema) {
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
  },

  get DBRef() {
    return { $ref: this.type, $id: this.id };
  },

  get parent() {
    var parent = this.flag('parent');
    return parent;
  },

  set parent(ctx) {
    this.flag('parent', ctx, true);
  },

  get store() {
    var store = this.flag('store');
    if (store) return store;
    var parent = this.flag('parent');
    if (parent) return parent.store;
    return null;
  },

  set store(store) {
    if (store instanceof Store) {
      this.flag('store', store, true);
    }
  },

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

  flag: function(key, value, silent) {
    silent = ('boolean' === typeof silent) ? silent : false;
    var self = this;
    var flags = this._flags || (this._flags = new Hash());

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
  },

  /**
   * # .get()
   *
   * Return the value of an attribute.
   *
   * @param {String} property
   * @api public
   */

  get: function(prop) {
    return Query.getPathValue(prop, this._attributes);
  },

  /**
   * # .has()
   *
   * Returns whether an attribute is defined.
   *
   * @param {String} property path
   * @api public
   */

  has: function(prop) {
    return 'undefined' !== typeof Query.getPathValue(prop, this._attributes);
  },

  /**
   * # .set()
   *
   * Set the value of a set of attributes. Attributes
   * will be merged with existing attributes.
   *
   * #### Options
   *
   * * _force_  {Boolean} force the operation
   *
   * @param {String} path
   * @param {Mixed} value
   * @param {Object} options
   * @returns {Boolean}
   * @api public
   */

  set: function(path, value, opts) {
    opts = opts || {};

    if (!opts.force && this.schema) {
      var valid = this.schema.validatePath(path, value);
      if (!valid) return false
    }

    Query.setPathValue(path, value, this._attributes);
    this.flag('dirty', true);
    return true;
  },

  /**
   * # .merge()
   *
   * Merge given attributes.
   *
   * ### Example
   *
   *        model.merge({ hello: 'world' });
   *        model.merge({ open: { source: 'always' }});
   *
   * #### Options
   *
   * * _force_  {Boolean} force the operation
   *
   * @param {Object} attributes
   * @param {Object} options
   * @returns {Boolean}
   * @api public
   */

  merge: function(attrs, opts) {
    var oldProps = _.merge({}, this._attributes);
    var newProps = _.merge(oldProps, attrs);

    opts = opts || {};

    if (!opts.force && this.schema) {
      var valid = this.schema.validate(newProps);
      if (!valid) return false;
      newProps = this.schema.getValue(newProps, { preserve: true });
    }

    this._attributes = newProps;
    this.flag('dirty', true);
    return true;
  },

  validate: function() {
    if (!this.schema) return undefined;
    return this.schema.validate(this._attributes);
  },

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

  save: function(opts, cb) {
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
  }

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

  fetch: function(opts, cb) {
    if (opts && 'function' === typeof opts) cb = opts, opts = {};
    cb = cb || noop;
    opts = opts || {};

    if (!this.store) return cb(errors.create('no store'));

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

    this.store.sync('get', this)
      .then(storeSuccess.call(this, opts, cb), cb)
  },

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

  destroy: function(opts, cb) {
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
  },

  loadRef: function(ref, cb) {
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
  }

};
