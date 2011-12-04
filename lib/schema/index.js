
var tea = require('tea')
  , drip = require('drip');

function Schema (definition) {
  drip.call(this);

  this.paths = {};
  this.iteratePath(this.paths, definition);
}

tea.merge(Schema.prototype, drip.prototype);

Schema.prototype.iteratePath = function (parent, paths) {
  for (var _p in paths) {
    var p = paths[_p];
    if (tea.isFunction(p) || p.name) {
      parent[_p] = { type: p };
    } else if (p.type && tea.isFunction(p.type)) {
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
  var datum = tea.merge({}, data);
  return this._validate(this.paths, datum);
};

Schema.prototype._validate = function (parent, datum) {
  for (var p in parent) {
    var path = parent[p];

    if (path.required && !datum[p]) {
      return false;
    } else if (path.type && (tea.isFunction(path.type) || path.type.name)) {
      if (!this._validateType(path.type, datum[p])) return false;
      delete datum[p];
    } else if (datum[p]) {
      var sub = this._validate(parent[p], datum[p]);
      if (!sub) return false;
      delete datum[p];
    }
  }

  return true;
};

Schema.prototype._validateType = function (type, data) {
  switch (type) {
    case Array:
      return data && tea.isArray(data);
    case String:
      return data && tea.isString(data);
    case Number:
      return data && tea.isNumber(data);
    default:
      if (type.name) return type.validate(data);
      return false;
  }
};

var exports = module.exports = Schema;

exports.Type = require('./type');