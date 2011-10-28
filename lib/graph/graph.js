
var tea = require('tea')
  , drip = require('drip');

module.exports = Graph;

function Graph (options) {
  drip.call(this);
  
  options = options || {};
  
  this._models = {};
  this._collections = {};
  
  this._objects = [];
  this._byId = {};
  
  this.store = options.store || this.store || null;
  
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
  return this;
};


Graph.prototype.add = function (type, attributes, callback) {
  var model = this._models[type];
  if (!model) {
    callback('Model `' + type + '` doesn\'t exist in Graph.', null);
    return;
  }
  
  var object = new model(attributes)
    , address = '/' + type + '/' + object.id;
  
  this._objects.push(object);
  this._collections[type].add(object);
  
  this.emit('new:' + type, object);
  
  if (tea.isFunction(callback)) callback(null, object);
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
  
  if (!this._models[type])
    this._models[type] = model;
  
  if (!this._collections[type]) {
    var collection = { model: model, path: type };
    
    if (this.store) collection.store = this.store;
    
    this._collections[type] = new Seed.Collection([], collection);
  }
  
  return this;
};

Graph.prototype.length = function () {
  return this._objects.length;
};