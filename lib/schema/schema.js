
var tea = require('tea')
  , drip = require('drip');

module.exports = Schema;

function Schema (definition) {
  drip.call(this);
  
  this.paths = {};
  this.iteratePath(this.paths, definition);
}

tea.merge(Schema.prototype, drip.prototype);

Schema.prototype.iteratePath = function (parent, paths) {
  for (var p in paths) {
    var path = paths[p];
    if (tea.isFunction(path)) {
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

Schema.prototype.validate = function (datum) {
  var valid = true;
  
  for (var p in this.paths) {
    var path = this.paths[p];
    
    if (path.require && !datum[p])
      return false;
    
    if (path.type && tea.isFunction(path.type))
      if (!this._validateType(path.type, datum[p])) return false;
      delete datum[p];
  }
  
  return valid;
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
      break;
  }
};