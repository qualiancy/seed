
var tea = require('tea')
  , drip = require('drip');

module.exports = Graph;

function Graph (options) {
  drip.call(this);
  
  options = options || {};
  
  this._schemas = {};
  this._models = {};
  this._byId = [];
  
  this._initialize(options);
  this.initialize();
  return this;
}

tea.merge(Graph.prototype, drip.prototype);

Graph.extend = tea.extend;

Graph.toString = function () {
  return '[object Graph]';
};

// public initilize function
Graph.prototype.initialize = function () {};

// privite initialize function
Graph.prototype._initialize = function (options) {
  var self = this;
  
  if (options.models && tea.isArray(options.models)) {
    var models = options.models;
    models.forEach(function (model) {
      console.log('here');
      self.use(model);
    });
  }
  
};


Graph.prototype.add = function (type, object) {
  
};

Graph.prototype.use = function (model) {
  var type = model.type;
  
  this._schemas[type] = model;
  return this;
};

Graph.prototype.length = function () {
  return this._byId.length;
};