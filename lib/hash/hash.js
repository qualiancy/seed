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
  
  // not directly setting as will eventually have validation
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
  var obj = {};

  obj[key] = value;
  this._data[key] = value;

  if (!silent) {
    this.emit('set', obj);
    this.emit('set:' + key, obj);
  }
};

Hash.prototype.del = function (key, silent) {
  var data = this._data[key];
  
  if (data) delete this._data[key];
  
  if (!silent) {
    this.emit('delete', data);
    this.emit('delete:' + key, data);
  }
};

Hash.prototype.at = function (index) {
  var hash = this.toArray()[index];
  
  for (var key in hash) {
    return hash[key];
  }
  
  return undefined;
};

Hash.prototype.each = function (fn) {
  var index = 0;
  for (var key in this._data) {
    fn(key, this._data[key], index);
    index++;
  }
};

Hash.prototype.map = function (fn) {
  var hash = tea.merge({}, this._data);
  
  for (var key in hash) {
    hash[key] = fn(hash[key], key);
  }
  
  return new Hash(hash);
};

Hash.prototype.select = function (fn) {
  var hash = {};
  
  for (var key in this._data) {
    var pass = fn(this._data[key]);
    
    if (pass)
      hash[key] = this._datap[key];
  }
  
  return new Hash(hash);
};

Hash.prototype.values = function () {
  var arr = [];
  
  for (var key in this._data) {
    arr.push(this._data[key]);
  }
  
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
