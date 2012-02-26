/*!
 * Seed :: Model
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var util = require('util')
  , Query = require('filtr')

/*!
 * Seed component dependancies
 */

var _ = require('./utils')
  , EventEmitter = require('./events')
  , Hash = require('./hash')
  , Schema = require('./schema')
  , SeedError = require('./error')
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
  options = options || {};

  EventEmitter.call(this);

  this.uid = uid.gen();
  this._flags = new Hash();
  this._attributes = {};

  this.type = options.type || this.type || 'model';
  this.store = options.store || this.store || null;
  this.parent = options.parent || this.parent || {};
  this.schema = options.schema || this.schema || null;

  var type = options.type || this._type || 'model';
  delete this._type;

  Object.defineProperty(this, 'type',
    { get: function () {
        return type;
      }
    , enumerable: true
  });

  this.merge(attributes, {
      silent: true
    , force: true
  });

  this.flag('new', true);
  this.flag('dirty', true);

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

  klass = klass || {};
  klass._type = type;

  proto = proto || {};
  proto._type = type;

  var child = _.inherits(this, proto, klass);
  child.extend = this.extend;
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
 * # id (getter)
 *
 * returns the id of the current model item
 *
 * # id (setter)
 *
 * shortcut to set the id of the current model id
 *
 * @param {Integer|String} id
 * @api public
 */

Object.defineProperty(Model.prototype, 'id',
  { get: function () {
      return this.get('_id');
    }
  , set: function (id) {
      this.set('_id', id);
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
 * @name .flag()
 */

Model.prototype.flag = function (key, value) {
  var self = this;

  if ('undefined' === typeof value || null === value) {
    return this._flags.get(key);
  } else {
    if (!Array.isArray(key)) {
      key = [ key ];
    }

    key.forEach(function (elem) {
      self._flags.set(elem, value);
      self.emit([ 'flag', elem ], value);
    });

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
  return Query.getPathValue(prop, this._attributes);
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
    var valid = this.schema.validate(props);
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
      return failure(new SeedError('Attributes not valid', { code: 'ENOTVALID' }));

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
      self.parent.del('/' + self.type + '/' + self.id);

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
    var sync = store.sync('destroy', this)
    sync.then(
        success
      , function (ex) { callback.call(self, ex); }
    );
  } else {
    callback.call(self, new SeedError('No storage defined.', { code: 'ENOSTORE' }));
  }
};
