/*!
 * Seed :: Schema
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
  , Hash = require('./hash')
  , Query = require('./query')
  , EventEmitter = require('./events');

/*!
 * main export
 */

module.exports = Schema;

function Schema (definition) {
  EventEmitter.call(this);

  this.paths = new Hash();

  iteratePaths.call(this, '', definition);
}

Schema.Type = require('./schematypes');

util.inherits(Schema, EventEmitter);

Object.defineProperty(Schema.prototype, 'indexes',
  { get: function () {
      return this.paths.find({ 'index': true });
    }
});

Object.defineProperty(Schema.prototype, 'required',
  { get: function () {
      return this.paths.find({ $or:
        [ { 'index': true }
        , { 'required': true } ]
      });
    }
});

Schema.prototype.validate = function (data) {
  var self = this
    , valid = true
    , required = this.required
    , reqkeys = required.keys

  this.paths.each(function (def, path) {
    var datum = Query.getPathValue(path, data);

    if (required.has(path) && !datum) {
      return valid = false;
    } else if (required.has(path) && datum) {
      reqkeys.splice(reqkeys.indexOf(path), 1);
    }

    if (datum) {
      var casted = self.castAsType(def, datum);
      if (!casted.validate()) return valid = false;
    }

  });

  if (valid === false) {
    return false;
  } else {
    if (reqkeys.length === 0) return true;
    else return false;
  }
};


Schema.prototype._validate = function (parent, datum) {
  for (var _p in parent) {
    var p = parent[_p]
      , data = datum[_p];

    // First we check to see if the path
    // is a required path.
    if (p.required && !data) {
      return false;
    }

    // Next we take the data and cast it as
    // the type identified in the schema (if not embedded object)
    if (data && p.type && ('function' === typeof p.type || p.type.name)) {
      var casted = this._castAsType(p, data);

      if (!casted.validate()) return false;
      delete datum[_p];

    // finally, if it is an embedded object, we iterate
    } else if (data) {
      var sub = this._validate(parent[_p], data);
      if (!sub) return false;
      delete datum[_p];
    }
  }

  return true;
};

function iteratePaths (path, definition) {
  var def;
  for (var name in definition) {
    def = definition[name];

    // basic def: { first_name: String }
    if ((def && 'function' === typeof def) || def.name) {
      this.paths.set(path + name, { type: def });
    // complex def: { first_name: { type: String, index: true } [..]
    } else if (def.type && 'function' == typeof def.type) {
      var spec = { type: def.type };
      _.merge(spec, def);
      this.paths.set(path +  name, spec);
    // nested
    } else {
      iteratePaths.call(this, path + name + '.', def);
    }
  }
}

Schema.prototype.castAsType = function (path, data) {
  var type = new Schema.Type[path.type.name](path, data);
  return type;
};
