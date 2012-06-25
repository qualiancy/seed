/*!
 * Seed :: Schema
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
  , Hash = require('./base/hash')
  , Query = require('./base/query')
  , EventEmitter = require('./base/events');

/*!
 * main export
 */

module.exports = Schema;

/**
 * # Schema
 *
 * Create a schema instance.
 *
 * @param {Object} definition
 * @api public
 * @name constructor
 */

function Schema (definition) {
  EventEmitter.call(this);
  this.paths = new Hash();
  this._definition = definition;
  iteratePaths.call(this, '', definition);
}

/*!
 * expose types
 */

Schema.Type = require('./schematypes');

/*!
 * Inherit from EventEmitter
 */

inherits(Schema, EventEmitter);

/**
 * # indexes (getter)
 *
 * Retrieve a list of all indexes for the current schema
 *
 * @api public
 * @returns Seed.Hash
 */

Object.defineProperty(Schema.prototype, 'indexes',
  { get: function () {
      return this.paths.find({ 'index' : { $and:
        [ { $ne: undefined }
        , { $ne: false }
        , { $ne: null }
        , { $ne: 0 } ]
      }});
    }
});

/**
 * # required
 *
 * Retrieve a list of all required fields for the current schema
 *
 * @api public
 * @returns Seed.Hash
 */

Object.defineProperty(Schema.prototype, 'required',
  { get: function () {
      return this.paths.find({ 'required': { $and:
        [ { $ne: undefined }
        , { $ne: false }
        , { $ne: null }
        , { $ne: 0 } ]
      }});
    }
});

/**
 * # validate
 *
 * Check to see if a given set of data is valid
 * for the current schema.
 *
 * @param {Object} data
 * @returns Boolean validity
 * @api public
 */

Schema.prototype.validate = function (data) {
  var self = this
    , valid = true
    , required = this.required;

  this.paths.each(function (def, path) {
    var datum = Query.getPathValue(path, data);

    if (required.has(path) && 'undefined' === typeof datum)
      return valid = false;

    if ('undefined' !== typeof datum && def.type) {
      var casted = self.castAsType(path, datum);
      if (!casted.validate()) return valid = false;
    }
  });

  return valid;
};

/**
 * # getValue
 *
 * Given a set of data, get the schema's appropriate data
 * values for each of the paths.
 *
 * @param {Object} data
 * @api public
 */

Schema.prototype.getValue = function (data) {
  var self = this
    , dest = {};

  this.paths.each(function (def, path) {
    var datum = Query.getPathValue(path, data);
    if ('undefined' !== typeof datum && def.type) {
      var casted = self.castAsType(path, datum)
        , val = casted.getValue();
      Query.setPathValue(path, val, dest);
    }
  });

  return dest;
};

/**
 * # validatePath
 *
 * Given a point of data at a given path, determine
 * if it is valid for the current schema.
 *
 * @param {String} path
 * @param {Mixed} data
 * @api public
 */

Schema.prototype.validatePath = function (path, value) {
  if (!this.paths.has(path)) return true;
  if (this.required.has(path) && !value) return false;
  var casted = this.castAsType(path, value);
  return casted.validate();
};

/*!
 * # iteratePaths
 *
 * Called on constructor to convert a given schema
 * definition to a Seed.Hash of path:spec values.
 *
 * Will continually iterate until all paths are covered.
 *
 * @param {String} path
 * @param {Object} definition
 * @api private
 */

function iteratePaths (path, definition) {
  for (var name in definition) {
    var def = definition[name];

    // basic def: { first_name: String }
    if ((def && 'function' === typeof def) || def.name) {
      this.paths.set(path + name, { type: def });

    // complex def: { first_name: { type: String, index: true } [..]
    } else if (def.type && 'function' == typeof def.type) {
      var spec = { type: def.type };
      _.merge(spec, def);
      this.paths.set(path +  name, spec);

    // embedded schemas
    } else if (Array.isArray(def) && 'undefined' !== def[0]) {
      var spec = { type: Schema.Type.EmbeddedSchema };
      spec.schema = (def[0] instanceof Schema) ? def[0] : new Schema(def[0]);
      this.paths.set(path + name, spec);

    // nested definition
    } else {
      iteratePaths.call(this, path + name + '.', def);
    }
  }
}

/**
 * # castAsType
 *
 * Take a specific data point and path spec, cast the
 * data into the type constructor to access Seed.Type
 * helper methods. See each type for a list methods.
 *
 * @param {Object} path specification
 * @param {Mixed} data element
 * @api public
 */

Schema.prototype.castAsType = function (path, data) {
  var def = this.paths.get(path)
    , type = new Schema.Type[def.type.name](def, data);
  return type;
};
