
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
      if (path.required) parent[p].required = path.required;
    } else {
      parent[p] = {};
      this.iteratePath(parent[p], path);
    }
  }
  
  return this;
};

Schema.prototype.validate = function (data) {
  var valid = true;
  
  
  return valid;
};