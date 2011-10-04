var assert = require('assert'),
    seed = require('seed');

var sherlock = {
  spy: function(fn) {
    if (!fn) fn = function() {};
    function proxy() {
      var args = Array.prototype.slice.call(arguments);
      proxy.calls.push(args);
      proxy.called = true;
      fn.apply(this, args);
    }
  
    proxy.prototype = fn.prototype;
    proxy.calls = [];
    proxy.called = false;
    
    return proxy;
  }
}



module.exports = {
  'version exists': function () {
    assert.isNotNull(seed.version);
  },
  'model creation': function () {
    var person = seed.model.extend();
    
    var jake = new person({
      name: 'jake'
    });
    
    var people = new seed.collection([jake]);
    
    assert.type(jake, 'object', 'model of correct type');
    assert.eql(jake._attributes, { name: 'jake' }, 'model has correct attributes');
    assert.equal(true, jake instanceof person, 'model is correct instance');
  },
  'models have events': function () {
    var person = seed.model.extend(),
        n = 0;
    
    var jake = new person({
      name: 'jake'
    });
    
    jake.on('testing', function() {
      n++;
    });
    
    setTimeout(function() {
      jake.emit('testing');
    }, 200);
    
    this.on('exit', function () {
      assert.equal(n, 1, 'event has successfully executed callback');
    });
  }
};