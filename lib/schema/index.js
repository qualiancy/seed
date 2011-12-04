
var util = require('util')
  , drip = require('drip');

var utils = require('../utils');

function Schema (definition) {
  drip.call(this);

  this.paths = {};
  this.iteratePath(this.paths, definition);
}

util.inherits(Schema, drip);

Schema.prototype.iteratePath = function (parent, paths) {
  for (var _p in paths) {
    var p = paths[_p];

    if ((p && 'function' === typeof p) || p.name) {
      parent[_p] = { type: p };
    } else if (p.type && 'function' === typeof p.type) {
      parent[_p] = { type: p.type };
      if (p.required) parent[_p].required = p.required;
    } else {
      parent[_p] = {};
      this.iteratePath(parent[_p], p);
    }
  }

  return this;
};

Schema.prototype.validate = function (data) {
  var datum = utils.merge({}, data);
  return this._validate(this.paths, datum);
};

Schema.prototype._validate = function (parent, datum) {
  for (var _p in parent) {
    var p = parent[_p]
      , data = datum[_p];

    if (p.required && !data) {
      return false;
    } else if (p.type && ('function' === typeof p.type || p.type.name)) {
      if (!this._validateType(p.type, data)) return false;
      delete datum[_p];
    } else if (data) {
      var sub = this._validate(parent[_p], data);
      if (!sub) return false;
      delete datum[_p];
    }
  }

  return true;
};

Schema.prototype._validateType = function (type, data) {
  switch (type) {
    case Array:
      return data && Array.isArray(data);
    case String:
      return data && 'string' === typeof data;
    case Number:
      return data && 'number' === typeof data;
    default:
      if (type.name) return type.validate(data);
      return false;
  }
};

var exports = module.exports = Schema;

exports.Type = require('./type');