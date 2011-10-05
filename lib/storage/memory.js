var utils = require('../utils'),
    Store = require('../store'),
    oath = require('oath');
    
var fiz = new utils.uid();

// simulating async (other transports will be)
function nextTick(callback) {
  setTimeout(callback, 0);
}

function MemoryStore () {
  this.store = {};
}

utils.merge(MemoryStore.prototype, Store.prototype);

MemoryStore.prototype.set = function (seed) {
  var promise = new oath(),
      self = this;
  nextTick(function() {
    var id = seed.data.id;
    if (!id) {
      id = fiz.gen();
      seed.data.id = id;
    }
    self.store[id] = seed.data;
    promise.resolve(self.store[id]);
  });
  
  return promise;
};

MemoryStore.prototype.get = function (seed) {
  var promise = new oath(),
      self = this,
      id = seed.data.id;
  
  nextTick(function() {
    if (self.store[id]) { 
      promise.resolve(self.store[id]);
    } else {
      promise.reject({ code: 3, message: 'seed doesn\'t exist on server'});
    }
  });
  
  return promise;
};

MemoryStore.prototype.destroy = function (seed) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    var id = seed.data.id;
    if (!id) { promise.reject({ code: 1, message: 'can\'t read without an id' }); return; }
    if (!self.store[id]) { promise.reject({ code: 3, message: 'seed doesn\'t exist on server'}); return; }

    if (self.store[id]) delete self.store[id];
    promise.resolve(id);
  });
  
  return promise;
};

module.exports = MemoryStore;