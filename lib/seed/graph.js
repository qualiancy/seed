
var util = require('util')
  , Drip = require('drip');

var Hash = require('./hash')
  , Schema = require('./schema')
  , Model = require('./model')
  , utils = require('./utils');

module.exports = Graph;

function Graph (options) {
  Drip.call(this, { delimeter: ':' });

  options = options || {};

  this._flags = new Hash();
  this._models = new Hash();
  this._objects = new Hash(null, { findRoot: '_attributes' });

  this.store = options.store || this.store || null;

  this.initialize(options);
}

util.inherits(Graph, Drip);

Graph.extend = utils.extend;

Graph.toString = function () {
  return '[object Graph]';
};

// public initilize function
Graph.prototype.initialize = function () {};

Object.defineProperty(Graph.prototype, 'types',
  { get: function () {
      return this._models.keys;
    }
});

Object.defineProperty(Graph.prototype, 'count',
  { get: function () {
      return this._objects.length;
    }
});

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

Graph.prototype.define = function (type, object) {
  var model;

  if (!object) {
    object = type;
    type = object.type || null;
  }

  /* -- START object type detection -- */
  // TODO: Turn this into a function

  // First we check to see if the object passed
  // is a model defintion, as from Model.extend.
  if (object.toString() == '[object Model]') {
    if (!type && object.type != 'model') {
      type = object.type;
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
  /* -- END object type detection -- */

  this._models.set(type, object);
};

Graph.prototype.set = function (address, attributes) {
  var type = address.split('/')[1]
    , id = address.split('/')[2]
    , model = this._models.get(type)
    , isnew = true;

  attributes = attributes || {};

  if (!model)
    throw new Error('Type [' + type + '] not defined for Seed#Graph');

  if (!id)
    throw new Error('No id for Seed#Graph of type [' + type + ']');

  attributes.id = id;

  var object = this._objects.get(address);

  if (!object) {
    object = new model(attributes, { parent: this });
  } else {
    object.set(attributes);
    isnew = false;
  }

  this._objects.set(address, object);

  object.flag('type', type);
  object.flag('dirty', true);

  var ev = ((isnew) ? 'add' : 'change');

  this.emit([ ev, type, address ], object);
  this.emit([ 'dirty', type, address ], object);

  return object;
};

Graph.prototype.get = function (address) {
  return this._objects.get(address);
};

Graph.prototype.del = function (address) {
  this._objects.del(address);
  return;
};

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
    if (count == self.count) {
      //self._refreshLookups();
      callback.call(self, ret_err);
    }
  };

  this.each(function (model) {
    model.save.call(model, opts, after);
  });
};

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
    if (count == self.count) {
      //self._refreshLookups();
      callback.call(self, ret_err);
    }
  };

  this.each(function (model) {
    model.fetch.call(model, opts, after);
  });
};

Graph.prototype.fetch = function (type, query, callback) {
  if (this._models.count === 0) throw new Error('Can\'t fetch without a model definition');

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
      self.set('/' + type + '/' + attrs.id, attrs);
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

Graph.prototype.each = function (type, iterator, context) {
  if (type && 'function' === typeof type) {
    context = iterator;
    iterator = type;
    type = null;
  }

  context = context || this;

  if (type) {
    var models = this._objects.select(function (model) {
      return model.type == type;
    });

    models.each(iterator, context);
  } else {
    this._objects.each(iterator, context);
  }
};

Graph.prototype.find = function (query) {
  return this._objects.find(query);
};

Graph.prototype.filter = function (type) {
  if (type) {
    var models = this._objects.select(function (model) {
      return model.type == type;
    });
    return models;
  } else {
    return this._objects.clone();
  }
};

Graph.prototype.flush = function (type) {
  if (type) {
    var models = this._objects.select(function (model) {
      return model.type != type;
    });
    this._objects = models;
    this.emit([ 'flush', type ]);
  } else {
    this._objects = new Hash();
    this.emit([ 'flush', 'all' ]);
  }
};