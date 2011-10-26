
var tea = require('tea')
  , drip = require('drip');

var Type = require('./type');

function Schema (definition) {
  drip.call(this);
  
  this.paths = {};
  this.iteratePath(this.paths, definition);
}

tea.merge(Schema.prototype, drip.prototype);

Schema.prototype.iteratePath = function (parent, paths) {
  for (var p in paths) {
    var path = paths[p];
    if (tea.isFunction(path) || path.name) {
      parent[p] = { type: path };
    } else if (path.type && tea.isFunction(path.type)) {
      parent[p] = { type: path.type };
      if (path.require) parent[p].require = path.require;
    } else {
      parent[p] = {};
      this.iteratePath(parent[p], path);
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
    
    if (path.require && !datum[p]) {
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

exports.Type = require('./type/index');