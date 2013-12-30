/*!
 * Seed :: Graph
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
  , errors = require('./errors/graph')
  , EventEmitter = require('./base/events')
  , Hash = require('./base/hash')
  , Model = require('./model')
  , Promise = require('./base/promise')
  , Schema = require('./schema')
  , Store = require('./store');

/*!
 * Graph specific dependancies
 */

var helper = require('./graph/helpers')
  , Traversal = require('./graph/traversal');

/*!
 * Graph "constants"
 */

var noop = function () {};

/*!
 * Main export
 */

module.exports = Graph;

/**
 * # Graph (constructor)
 *
 * Creates a new graph with a given set of options
 *
 * #### Options
 * - **store** - Seed compatible storage engine to over-ride all
 * previously defined storage engines
 * - **type** - Override the graph type string. Used for storage.
 *
 * @param {Object} options
 * @api public
 * @name constructor
 */

function Graph (options) {
  // setup
  EventEmitter.call(this);
  options = options || {};

  // config
  this._models = new Hash();
  this._vertices = new Hash(null, { findRoot: '_attributes' });
  this._edges = new Hash(null, { findRoot: '_attributes' });

  if (options.store) this.store = options.store;
  if (options.type) this.flag('type', options.type, true);

  // init
  this.initialize.apply(this, arguments);
}

/*!
 * Inherits from Drip Event Emitter
 */

inherits(Graph, EventEmitter);

/**
 * # Graph.extend(proto, class)
 *
 * Helper to provide a simple way to extend the prototype
 * of a model.
 *
 * @param {Object} prototype definition
 * @param {Object} class definition
 * @returns {Model} model constructor modified
 * @api public
 */

Graph.extend = function (type, proto, klass) {
  if (!(type && 'string' === typeof type)) {
    klass = proto;
    proto = type;
    type = 'graph';
  }

  var opts = {};
  klass = klass || {};
  proto = proto || {};

  if (proto.store) {
    opts.store = proto.store;
    delete proto.store;
  }

  // create our child
  var self = this
    , child = function () { self.apply(this, arguments); };

  inherits.merge([ child, this ]);
  inherits.inherits(child, this);
  if (proto) inherits.merge([ child.prototype, proto ]);
  child.extend = this.extend;
  child.prototype.__type = type;

  // custom initialize to pass on flags
  child.prototype.initialize = function () {
    var options = arguments[0] || {};
    delete this.__type;
    if (!options.type) this.flag('type', type, true);
    if (!options.store && opts.store) this.flag('store', opts.store, true);
    if (proto.initialize) proto.initialize.apply(this, arguments);
  };

  return child;
}

/*!
 * # #toString()
 *
 * Provides a sane toString default.
 */

Graph.toString = function () {
  return '[object Graph]';
};

/*!
 * # initialize
 *
 * noop - Function to be called upon construction.
 */

Graph.prototype.initialize = function () {};

/**
 * # type (getter)
 *
 * Gets the flag for the current type.
 *
 * @param {String} type
 * @api public
 */

Object.defineProperty(Graph.prototype, 'type',
  { get: function () {
      var type = this.flag('type');
      if ('undefined' === typeof type) {
        type = 'graph';
        this.flag('type', type, true);
      }
      return type;
    }
});

/**
 * # types
 *
 * Returns array of all defined model types.
 *
 * @returns {Array} types of models defined
 * @api public
 * @name types
 */

Object.defineProperty(Graph.prototype, 'types',
  { get: function () {
      return this._models.keys;
    }
});

/**
 * # length
 *
 * Returns number of objects in graph.
 *
 * @returns {Number} count of objects
 * @api public
 * @name length
 */

Object.defineProperty(Graph.prototype, 'length',
  { get: function () {
      return this._vertices.length;
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

Object.defineProperty(Graph.prototype, 'store',
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
 * current graph object
 *
 * @api public
 */

Graph.prototype.toString = function () {
  var type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
  return '[object ' + type + ']';
};

/**
 * # flag
 *
 * Flags are key:values that represent the models
 * state but are not syncronized with the server.
 *
 * ### Example
 *
 *        graph.flag('key'); // to get a value
 *        graph.flag('key', true); // to set a value
 *        graph.flag([ 'key1', 'key2' ], 'stringed');
 *
 * @param {String} key
 * @param {Mixed} value
 * @param {Boolean} silent
 * @api public
 * @name .flag()
 */

Graph.prototype.flag = function (key, value, silent) {
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
 * # .define([type], definition)
 *
 * Define a `type` of model that can be added to current instance of
 * Graph. Accepts Models, Schemas, or Schema Definitions.
 *
 * @param {String} type optional if providing a model
 * @param {Model|Schema|Object} definition
 * @api public
 * @name .define()
 */

Graph.prototype.define = function (type, object) {
  var model;

  if (!object) {
    object = type;
    type = object.type || null;
  }

  // First we check to see if the object passed
  // is a model defintion, as from Model.extend.
  if (object.toString() == '[object Model]') {
    if (!type && object.prototype.__type != 'model') {
      type = object.prototype.__type;
    } else if (!type && object.type == 'model') {
      throw new Error('Graph#define - invalid type from model');
    }

    model = object;

  // Next we check to see if the object passed
  // is an instance of Schema, as from new Schema().
  } else if (object instanceof Schema) {
    model = Model.extend(type, {
      schema: object
    });

  // Next we check to see if the object passed
  // is a plain js object, expected to be a Schema definition
  } else if (object && 'function' !== typeof object && Object(object) == object) {
    model = Model.extend(type, {
      schema: new Schema(object)
    });

  // Finally, we don't have a match so this whole
  // define process was just bust. Error!
  } else {
    throw new Error('Seed#Graph - Unable to define type [' + type + '] from object: ' + object.toString());
  }

  this._models.set(type, model);
};

/**
 * # .set(address, attributes, [options])
 *
 * Helper function to set values for a given model.
 *
 * #### Options
 * * **silent** - emit change events, defaults true
 *
 * @param {String} address `/type/_id`
 * @param {Object} attributes to change
 * @param {Object} options
 * @api public
 * @name .set()
 */

Graph.prototype.set = function (type, id, attributes, opts) {
  if (type instanceof Model) id = type, type = id.type;

  var model = this._models.get(type)
    , isNew = true
    , options = _.defaults(opts || {}, { dirty: true, silent: false });

  if (!model) throw errors.create('no type');
  if (!id) throw errors.create('no id');

  if (id instanceof Model) {
    var object = id
      , address = '/' + type + '/' + object.id;
    object.flag('parent', this);
    id = object.id;
  } else {
    if ('object' == typeof id) {
      attributes = id;
      id = attributes._id;
    }

    attributes = attributes || {};
    var address = '/' + type + '/' + id
      , object;
    if (id) object = this._vertices.get(address);
    if (!object) {
      object = new model({}, { parent: this });
      object.merge(attributes, { silent: true });
      if (id) object.id = id;
      address = '/' + type + '/' + object.id;
    } else {
      this._vertices.del(address);
      object.merge(attributes);
      isNew = false;
    }
  }

  this._vertices.set(address, object);
  object.flag('type', type, options.silent);
  object.flag('dirty', options.dirty, options.silent);

  if (!options.silent) {
    var ev = ((isNew) ? 'add' : 'change');
    this.emit([ ev, type, object.id ], object);
    if (object.flag('dirty')) this.emit([ 'dirty', type, object.id ], object);
  }

  return object;
};

/**
 * # .get(type, id)
 *
 * Get model of a specific type with `id`.
 *
 * @param {String} type name
 * @param {Mixed} id
 * @returns {Model}
 * @api public
 * @name .get()
 */

Graph.prototype.get = function (type, id) {
  var address = '/' + type + '/' + id;
  return this._vertices.get(address);
};

/**
 * # .has(type, id)
 *
 * Determine whether an id of type exists in the graph.
 *
 * @param {String} type name
 * @param {Mixed} id
 * @returns {Boolean} exists
 * @api public
 * @name .has()
 */

Graph.prototype.has = function (type, id) {
  if (type instanceof Model) {
    var model = type;
    type = model.type;
    id = model.id;
  }

  var address = '/' + type + '/' + id
    , exists = this._vertices.get(address);
  return ('undefined' !== typeof exists) ? true : false;
};

/**
 * # .del(address)
 *
 * Delete a model from the graph at a given address. Does not
 * sent delete command to storage engine.
 *
 * @param {String} address in the form `/type/_id`
 * @api public
 * @name .del()
 */

Graph.prototype.del = function (type, id) {
  if (type instanceof Model) {
    var model = type;
    type = model.type;
    id = model.id;
  }

  var address = '/' + type + '/' + id;
  this._vertices.del(address);
};


Graph.prototype.relate = function (vertX, vertY, rel, attrs) {
  if (!arguments.length >= 3) throw Error('Missing fields for Graph#relate');
  if (!this.has(vertX)) this.set(vertX);
    if (!this.has(vertY)) this.set(vertY);
  var edge = helper.buildEdge.apply(this, arguments);
  this._edges.set(edge.id, edge);
  return edge;
};

Graph.prototype.unrelate = function (vertX, vertY, rel) {
  if (!arguments.length >= 3) throw Error('Missing fields for Graph#unrelate');
  var edge = helper.getEdge.call(this, vertX, vertY, rel);
  this._edges.del(edge.id);
};

Graph.prototype.traverse = function (opts) {
  var traverse = new Traversal(this, opts || {});
  return traverse;
};

/**
 * # .each([type, iterator, context)
 *
 * Apply an iteration function to all instanciated models in the graph. Or,
 * optionally, to all instanciated models of a given type.
 *
 * @param {String} type optional
 * @param {Function} iterator
 * @param {Object} context to apply as `this` to iteration function
 * @api public
 * @name .each()
 */

Graph.prototype.each = function (type, iterator, context) {
  // refactor params
  if (type && 'function' === typeof type) {
    context = iterator;
    iterator = type;
    type = null;
  }

  // ensure context
  context = context || this;

  // build hash to iterate
  var filterType = function (model) { return model.type === type }
    , models = type
      ? this._vertices.filter(filterType)
      : this._vertices;

  // iterate
  models.each(iterator, context);
};

/**
 * # .find (query)
 *
 * Find all objects matching a given query. Does not
 * descriminate based on type. See Hash#find for more
 * information.
 *
 * @param {Object} query
 * @returns {Hash} models that match.
 * @see Hash#find
 * @api public
 */

Graph.prototype.find = function (query) {
  return this._vertices.find(query);
};

/**
 * # .filter (type)
 *
 * Filter provides a way to work with a subset of the
 * the graph. Can be used multiple ways:
 *
 *     // type filter
 *     var models = graph.filter('person');
 *
 *     // iteration filter
 *     var models = graph.filter(function (m) {
 *       return m.get('val') == true;
 *     });
 *
 *     // combination
 *     var models = graph.filter('person', function (m) {
 *       return m.get('val') == true;
 *     });
 *
 * @param {String} type
 * @param {Function} iterator
 * @param {Object} context to interpret as this in iterator
 * @see Hash#filter
 * @api public
 */

Graph.prototype.filter = function (type, iterator, context) {
  // if no type defined
  if ('function' == typeof type) {
    context = iterator || this;
    iterator = type;
    return this._vertices.filter(iterator, context);

  // if type defined
  } else if ('string' == typeof type) {
    context = context || this;
    var models = this._vertices.filter(function (model) {
      return model.type == type;
    });

    // check for iterator
    if ('function' == typeof iterator)
      return models.filter(iterator, context);
    else return models;

  // bad format
  } else {
    return undefined;
  }
};

/**
 * # .flush([type])
 *
 * Remove all items (of optional type) from the graph. This
 * does not delete on the server.
 *
 * @param {String} type
 * @api public
 * name .flush()
 */

Graph.prototype.flush = function (type) {
  if (type) {
    var filterType = function (model) { return model.type !== type; }
      , models = this._vertices.filter(filterType);
    this._vertices = models;
    this.emit([ 'flush', type ]);
  } else {
    this._vertices = new Hash(null, { findRoot: '_attributes' });
    this._edges = new Hash(null, { findRoot: '_attributes' });
    this.emit([ 'flush', 'all' ]);
  }
};

/**
 * # .push(options, callback)
 *
 * Perform a save action on all models in the graph.
 * Options are passed to a models `save` command.
 *
 * @param {Object} options
 * @param {Function} callback upon completion. (err)
 * @api public
 * @name .push()
 */

Graph.prototype.push = function (opts, cb) {
  // parse the parameters
  if (opts && 'function' === typeof opts) {
    cb = opts;
    opts = {};
  }

  // sane defaults
  cb = cb || noop;
  opts = opts || {};

  // self defintion & create useful callbacks
  var self = this
    , queueFn = function (fn, next) { fn(next); }
    , queue = async.queue(queueFn, 10)
    , resolved = function (next) { return function () { next(); } }
    , rejected = function (next) { return function (err) { next(err); } };

  // convert model#save into promise
  function pushModel (model, opts) {
    var defer = new Promise();
    model.save(opts, function (err) {
      if (err) return defer.reject(err);
      defer.resolve();
    });
    return defer.promise;
  }

  // Push `dirty` vertices to the server using model's save.
  this._vertices.each(function (model) {
    if (!model.flag('dirty')) return;
    queue.push(function (next) {
      pushModel(model, opts)
        .then(resolved(next), rejected(next));
    });
  });

  // refresh lookups for vertices
  queue.push(function (next) {
    helper.refreshLookups.call(self, self._vertices);
    next();
  });

  // Push `dirty` edges to the server using model's save.
  this._edges.each(function (edge) {
    if (!edge.flag('dirty')) return;
    queue.push(function (next) {
      pushModel(edge, opts)
        .then(resolved(next), rejected(next));
    });
  });

  // refresh lookups for edges
  queue.push(function (next) {
    helper.refreshLookups.call(self, self._edges);
    next();
  });

  // setup completion
  queue.drain = cb;
  queue.onerror = cb;
  queue.process();
};


/**
 * # .pull([options], callback)
 *
 * Perform a `fetch` on all models in the graph. Will
 * not pull in any new models. Options are passed to the model's
 * `fetch` command.
 *
 * @param {Object} options
 * @param {Function} callback upon completion. (error)
 * @api public
 * @name .pull()
 */

Graph.prototype.pull = function (opts, cb) {
  // parse the parameters
  if (opts && 'function' === typeof opts) {
    callback = opts;
    opts = {};
  }

  // sane defaults
  cb = cb || noop;
  opts = opts || {};

  // self definition & create useful callbacks
  var self = this
    , queueFn = function (fn, next) { fn(next); }
    , queue = async.queue(queueFn, 10)
    , resolved = function (next) { return function () { next(); } }
    , rejected = function (next) { return function (err) { next(err); } }

  // convert model#fetch to promise
  function pullModel (model, opts) {
    var defer = new Promise();
    model.fetch(opts, function (err) {
      if (err) return defer.reject(err);
      defer.resolve();
    });
    return defer.promise;
  }

  // Pull non-`new` vertices to the server using model's fetch.
  this._vertices.each(function (model) {
    if (model.flag('new') && !opts.force) return;
    queue.push(function (next) {
      pullModel(model, opts)
        .then(resolved(next), rejected(next));
    });
  });

  // refresh lookups for vertices
  queue.push(function (next) {
    helper.refreshLookups.call(self, self._vertices);
    next();
  });

  // Pull non-`new` edges to the server using model's fetch.
  this._edges.each(function (edge) {
    if (edge.flag('new') && !opts.force) return;
    queue.push(function (next) {
      pullModel(edge, opts)
        .then(resolved(next), rejected(next));
    });
  });

  // refresh lookups for edges
  queue.push(function (next) {
    helper.refreshLookups.call(self, self._edges);
    next();
  });

  // setup completion
  queue.drain = cb;
  queue.onerror = cb;
  queue.process();
};


/**
 * # .fetch(type, query, callback)
 *
 * Submit a query to the storage engine for a given type and populate
 * the graph with the results.
 *
 * @param {String} type of model to fetch
 * @param {Object} query to pass directly to storage engine
 * @param {Function} callback upon completion. (error)
 * @api public
 * @name .fetch()
 */

Graph.prototype.fetch = function (type, query, cb) {
  // check params
  if (query && 'function' === typeof query) {
    cb = query;
    query = {};
  }

  // sane defaults
  cb = cb || noop;
  query = query || {};

  // check needed items
  if (!this.store) return cb(errors.create('no store'));
  if (!this._models.has(type)) return cb(errors.create('no type'));

  // params
  var self = this;

  // on success
  function success (data) {
    data.forEach(function(attrs) {
      self.set(type, attrs._id, attrs, { dirty: false });
    });
    cb();
  };

  // perform db action
  this.store.sync('fetch', { type: type }, query)
    .then(success, cb);
};
