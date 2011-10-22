var tea = require('tea')
  , drip = require('drip');

module.exports = Hash;

function Hash (values) {
  drip.call(this);
  
  var self = this;
  
  this._data = {};
  
  this.__defineGetter__('length', function () {
    var arr = self.toArray();
    return arr.length;
  });
  
  for (var key in values) {
    self.set(key, values[key], true);
  }
}

tea.merge(Hash.prototype, drip.prototype);

Hash.prototype.initialize = function () {};

Hash.prototype.validate = function (value) {
  return true;
};

Hash.prototype.get = function (key) {
  return this._data[key];
};

Hash.prototype.set = function (key, value, silent) {
  var obj = {}
    , index = 0;

  obj[key] = value;
  this._data[key] = value;
  index = this.index(key);
  
  if (!silent) {
    this.emit('set', index);
    this.emit('set:' + key, index);
  }
};

Hash.prototype.del = function (key, silent) {
  if (this._data[key])
    delete this._data[key];
  
  if (!silent) {
    this.emit('delete', key);
    this.emit('delete:' + key);
  }
};

Hash.prototype.at = function (index) {
  var key = this.keys()[index];
  return this._data[key];
};

Hash.prototype.index = function (key) {
  var keys = this.keys();
  return keys.indexOf(key);
};

Hash.prototype.each = function (fn) {
  var index = 0;
  for (var key in this._data) {
    fn(this._data[key], key, index);
    index++;
  }
};

Hash.prototype.map = function (iterator, context) {
  var hash = tea.merge({}, this._data)
    , context = context || null;
  
  this.each(function(value, key, index) {
    hash[key] = iterator.call(context, hash[key], key);
  });
  
  return new Hash(hash);
};

Hash.prototype.select = function (iterator, context) {
  var self = this
    , hash = new Hash()
    , context = context || null;
  
  this.each(function(value, key, index) {
    if (iterator.call(context, value, key)) 
      hash.set(key, value, true);
  });
  
  return hash;
};

Hash.prototype.sort = function (iterator) {
  
  
  return this;
};

Hash.prototype.keys = function () {  
  return Object.keys(this._data);
};

Hash.prototype.values = function () {
  var arr = [];
  
  this.each(function(value) {
    arr.push(value);
  });
  
  return arr;
};

Hash.prototype.toArray = function () {
  var arr = [];
  
  this.each(function (key, value) {
    var obj = { key: key, value: value };
    arr.push(obj);
  });
  
  return arr;
};

Hash.prototype.toJSON = function () {
  return JSON.stringify(this._data);
};
