var utils = require('../utils'),
    drip = require('drip'),
    oath = require('oath');
    
var fiz = new utils.uuid();

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
    var id = seed.data.id || seed.uuid;
    if (!id) {
      id = fiz.gen();
      seed.data.id = id;
    }
    // should we just update and not error?
    if (self.storage[id]) { promise.reject('already exists for id: ' + id); return; }
    self.storage[id] = seed.data;
    promise.resolve(self.storage[id]);
  });
  
  return promise;
};

Memory.prototype.read = function (seed) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    var id = seed.data.id;
    if (!id) { promise.reject('can\'t read without an id'); return; }
    if (!self.storage[id]) { promise.reject('seed doesn\'t exist on server'); return; }

    promise.resolve(self.storage[id]);
  });
  
  return promise;
};

Memory.prototype.update = function (seed) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    var id = seed.data.id;
    if (!id) { promise.reject('can\'t update without an id'); return; }
    if (!self.storage[id]) { promise.reject('seed doesn\'t exist on server'); return; }
    
    self.storage[id] = seed.data;
    promise.resolve(self.storage[id]);
  });
  
  return promise;
};

Memory.prototype.remove = function (seed) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    var id = seed.data.id;
    if (!id) { promise.reject('can\'t read without an id'); return; }
    if (!self.storage[id]) { promise.reject('seed doesn\'t exist on server'); return; }

    delete self.storage[id];
    promise.resolve(id);
  });
  
  return promise;
};

module.exports = Memory;