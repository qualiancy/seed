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
  var data = this._data[key];
  
  if (data) delete this._data[key];
  
  if (!silent) {
    this.emit('delete', key);
    this.emit('delete:' + key);
  }
};

Hash.prototype.at = function (index) {
  var hash = this.toArray()[index];
  
  for (var key in hash)
    return hash[key];
  
  return undefined;
};

Hash.prototype.index = function (key) {
  var obj = {}
    , arr = this.keys();
  
  if (!this._data[key])
    return undefined;
  
  return arr.indexOf(key);
};

Hash.prototype.each = function (fn) {
  var index = 0;
  for (var key in this._data) {
    fn(key, this._data[key], index);
    index++;
  }
};

Hash.prototype.map = function (iterator, context) {
  var hash = tea.merge({}, this._data)
    , context = context || null;
  
  for (var key in hash) {
    hash[key] = iterator.call(context, hash[key], key);
  }
  
  return new Hash(hash);
};

Hash.prototype.select = function (iterator, context) {
  var hash = new Hash()
    , context = context || null;
  
  for (var key in this._data) {
    if (iterator.call(context, this._data[key], key)) 
      hash.set(key, this._data[key], true);
  }
  
  return hash;
};

Hash.prototype.keys = function () {
  var arr = [];
  
  for (var key in this._data)
    arr.push(key);
  
  return arr;
};

Hash.prototype.values = function () {
  var arr = [];
  
  for (var key in this._data)
    arr.push(this._data[key]);
  
  return arr;
};

Hash.prototype.toArray = function () {
  var arr = [];
  
  for (var key in this._data) {
    var obj = {};
    obj[key] = this._data[key];
    arr.push(obj);
  }
  
  return arr;
};

Hash.prototype.toJSON = function () {
  return JSON.stringify(this._data);
};
