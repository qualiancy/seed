
var tea = require('tea')
  , drip = require('drip');

module.exports = Graph;

function Graph (options) {
  drip.call(this);
  
  options = options || {};
  
  this._schemas = {};
  this._models = [];
  this._byId = {};
  
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
      self.use(model);
    });
  }
  
};


Graph.prototype.add = function (type, object, callback) {
  var schema = this._schemas[type];
  if (!schema) {
    callback('Schema `' + type + '` doesn\'t exist in Graph.', null);
    return;
  }
  
  var model = new schema(object)
    , address = '/' + type + '/' + model.id;
  
  this._models.push(model);
  this._byId[address] = model;
  
  this.emit('new:' + type, model);
  
  if (tea.isFunction(callback)) callback(null, model);
};

Graph.prototype.remove = function (address, options, callback) {
  if (tea.isFunction(options)) {
    callback = options;
    options = {};
  }
  
  var model = this._byId[address];
  
  if (model) {
    this._models.splice(Array.prototype.indexOf(model), 1);
    delete this._byId[address];
    if (!options.silent) this.emit('remove', address);
  }
  if (callback && tea.isFunction(callback)) callback(null);
};

Graph.prototype.get = function (address, callback) {
  var model = this._byId[address];
  if (!model) {
    if (tea.isFunction(callback)) callback(null, null);
  } else {
    if (tea.isFunction(callback)) callback(null, model);
  }
};

Graph.prototype.use = function (model) {
  var type = model.type;
  this._schemas[type] = model;
  return this;
};

Graph.prototype.length = function () {
  return this._models.length;
};