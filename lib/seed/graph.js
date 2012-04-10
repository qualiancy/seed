/*!
 * Seed :: Graph
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

var EventEmitter = require('./events')
  , Hash = require('./hash')
  , Schema = require('./schema')
  , Model = require('./model')
  , SeedError = require('./error')
  , _ = require('./utils');

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
 * * **store** - Seed compatible storage engine to over-ride all
 * previously defined storage engines
 *
 * @param {Object} options
 * @api public
 * @name constructor
 */

function Graph (options) {
  EventEmitter.call(this);

  options = options || {};

  this._flags = new Hash();
  this._models = new Hash();
  this._objects = new Hash(null, { findRoot: '_attributes' });
  this.store = options.store || this.store || null;

  this.initialize(options);
}

/*!
 * Inherits from Drip Event Emitter
 */

util.inherits(Graph, EventEmitter);

Graph.extend = _.extend;

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
      return this._objects.length;
    }
});

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
 * @name .flag()
 */

Graph.prototype.flag = function (key, value) {
  if ('undefined' === typeof value || null === value) {
    return this._flags.get(key);
  } else {
    if (!Array.isArray(key)) key = [ key ];
    key.forEach(function (elem) {
      this._flags.set(elem, value);
      this.emit([ 'flag', elem ], value);
    }, this);
    return value;
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

  this._models.set(type, object);
};

/**
 * # .set(address, attributes, [options])
 *
 * Helper function to set values for a given model.
 * Address must be in the form of `/type/_id`.
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
  var model = this._models.get(type)
    , isnew = true
    , options = _.defaults(opts || {}, { dirty: true });


  if (!model)
    throw new SeedError('Type [' + type + '] not defined for Seed#Graph');
  if (!id)
    throw new SeedError('No id for Seed#Graph of type [' + type + ']');

  if (id instanceof Model) {
    var object = id
      , address = '/' + type + '/' + object.id;
    id = object.id;
  } else {
    if ('object' == typeof id) {
      attributes = id;
      id = attributes._id;
    }

    attributes = attributes || {};
    var address = '/' + type + '/' + id
      , object;
    if (id) object = this._objects.get(address);
    if (!object) {
      if (id) attributes._id = id;
      object = new model(attributes, { parent: this });
      address = '/' + type + '/' + object.id;
    } else {
      this._objects.del(address);
      object.merge(attributes, { force: true });
      isnew = false;
    }
  }

  this._objects.set(address, object);
  object.flag('type', type);
  object.flag('dirty', options.dirty);

  var ev = ((isnew) ? 'add' : 'change');
  this.emit([ ev, type, address ], object);

  if (object.flag('dirty'))
    this.emit([ 'dirty', type, address ], object);

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
  return this._objects.get(address);
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
  var address = '/' + type + '/' + id
    , exists = this._objects.get(address);
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
  var address = '/' + type + '/' + id;
  this._objects.del(address);
};

/**
 * # .push(options, callback)
 *
 * Perform a save action on all models in the graph.
 * Options are passed to a models `save` command.
 *
 * TODO: defaults to dirty only
 *
 * @param {Object} options
 * @param {Function} callback upon completion. (err)
 * @api public
 * @name .push()
 */

Graph.prototype.push = function (opts, callback) {
  var self = this
    , count = 0
    , ret_err = null;

  if (opts && 'function' === typeof opts) {
    callback = opts;
    opts = {};
  }

  if (!callback || 'function' !== typeof callback) {
    callback = function () {};
  }

  opts = opts || {};

  var after = function (err) {
    count++;
    if (err && ret_err === null)
      ret_err = err;
    if (count == self.length) {
      //self._refreshLookups();
      callback.call(self, ret_err);
    }
  };

  this.each(function (model) {
    model.save.call(model, opts, after);
  });
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

Graph.prototype.pull = function (opts, callback) {
  var self = this
    , count = 0
    , ret_err = null;

  if (opts && 'function' === typeof opts) {
    callback = opts;
    opts = {};
  }

  if (!callback || 'function' !== typeof callback) {
    callback = function () {};
  }

  opts = opts || {};

  var after = function (err) {
    count++;
    if (err && ret_err === null)
      ret_err = err;
    if (count == self.length) {
      refreshLookups.call(self);
      callback.call(self, ret_err);
    }
  };

  this.each(function (model) {
    model.fetch.call(model, opts, after);
  });
};

function refreshLookups () {
  var arr = this._objects.toArray();
  this._objects.flush(true);
  for (var i = 0; i < arr.length; i++) {
    var key = '/' + arr[i].value.type + '/' + arr[i].value.id
      , value = arr[i].value;
    this._objects.set(key, value, true);
  }
}

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

Graph.prototype.fetch = function (type, query, callback) {
  if (this._models.length === 0) throw new Error('Can\'t fetch without a model definition');

  var self = this
    , store = this.store;

  if (query && 'function' === typeof query) {
    callback = query;
    query = {};
  }

  if (!callback || 'function' !== typeof callback) {
    callback = function () {};
  }

  query = query || {};

  var success = function (data) {
    data.forEach(function(attrs) {
      self.set(type, attrs._id, attrs, { dirty: false });
    });

    callback.call(self, null);
  };

  var failure = function (err) {
    callback.call(self, err);
  };

  store
    .sync('fetch', { type: type }, query)
    .then(success, failure);
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
  if (type && 'function' === typeof type) {
    context = iterator;
    iterator = type;
    type = null;
  }

  context = context || this;

  if (type) {
    var models = this._objects.filter(function (model) {
      return model.type == type;
    });
    models.each(iterator, context);
  } else {
    this._objects.each(iterator, context);
  }
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
  return this._objects.find(query);
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
    return this._objects.filter(iterator, context);

  // if type defined
  } else if ('string' == typeof type) {
    context = context || this;
    var models = this._objects.filter(function (model) {
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
    var models = this._objects.filter(function (model) {
      return model.type != type;
    });
    this._objects = models;
    this.emit([ 'flush', type ]);
  } else {
    this._objects = new Hash();
    this.emit([ 'flush', 'all' ]);
  }
};
