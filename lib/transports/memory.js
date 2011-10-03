var utils = require('../utils'),
    drip = require('drip'),
    oath = require('oath');

// simulating async (other transports will be)
function nextTick(callback) {
  setTimeout(callback, 0);
}

function transport () {
  drip.call(this);
}

utils.extend(transport.prototype, drip.prototype);

transport.prototype.storage = {};

transport.prototype.create = function (data) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    var id = data.data.id || data._cid;
    if (!id) {
      id = data.path + utils.uid('trans');
      data.data.id = id;
    }
    if (self.storage[id]) promise.reject('already exists for id: ' + id);
    self.storage[id] = data.data;
    promise.resolve(self.storage[id]);
    console.log(self.storage);
  });
  
  return promise;
};

transport.prototype.read = function (id) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    
  });
  
  return promise;
};

transport.prototype.update = function (id, data) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    
  });
  
  return promise;
};

transport.prototype.remove = function (id) {
  var promise = new oath(),
      self = this;
  
  nextTick(function() {
    
  });
  
  return promise;
};

module.exports = transport;