var utils = require('../utils'),
    drip = require('drip'),
    oath = require('oath');

// simulating async (other transports will be)
function nextTick(callback) {
  setTimeout(callback, 0);
}

function Memory () {
  drip.call(this);
}

utils.extend(Memory.prototype, drip.prototype);

Memory.prototype.storage = {};

Memory.prototype.create = function (seed) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    var id = seed.data.id || seed._cid;
    if (!id) {
      id = seed.path + utils.uid('trans');
      seed.data.id = id;
    }
    if (self.storage[id]) promise.reject('already exists for id: ' + id);
    self.storage[id] = seed.data;
    promise.resolve(self.storage[id]);
    console.log(self.storage);
  });
  
  return promise;
};

Memory.prototype.read = function (seed) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    
  });
  
  return promise;
};

Memory.prototype.update = function (seed) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    
  });
  
  return promise;
};

Memory.prototype.remove = function (seed) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    var id = seed.data.id;
    if (!id) promise.reject('can\'t destroy with an id');
    if (!self.storage[id]) {
      promise.reject('seed doesn\'t exist on server');
    } else {
      delete self.storage[id];
      promise.resolve(id);
    }
    console.log(self.storage);
  });
  
  return promise;
};

module.exports = Memory;