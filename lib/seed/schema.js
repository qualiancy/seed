
var util = require('util')
  , drip = require('drip');

var utils = require('./utils');

var exports = module.exports = Schema
  , Type = exports.Type = require('./schematypes');

function Schema (definition) {
  drip.call(this);

  this.paths = {};
  this._iteratePath(this.paths, definition);
}

util.inherits(Schema, drip);

Schema.prototype.validate = function (data) {
  var datum = utils.merge({}, data);
  return this._validate(this.paths, datum);
};

Schema.prototype._iteratePath = function (parent, paths) {
  for (var _p in paths) {
    var p = paths[_p];

    if ((p && 'function' === typeof p) || p.name) {
      parent[_p] = { type: p };
    } else if (p.type && 'function' === typeof p.type) {
      parent[_p] = { type: p.type };
      utils.merge(parent[_p], p);
    } else {
      parent[_p] = {};
      this._iteratePath(parent[_p], p);
    }
  }

  return this;
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

Schema.prototype._castAsType = function (path, data) {
  var type = new Type[path.type.name](path, data);
  return type;
};




