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
  'collection add model': function () {
    var person = seed.model.extend({ className: 'Person' });
    
    var doctor = new person({ name: 'who' }),
        companion = new person({ name: 'amy' });
    
    var tardis = new seed.collection([doctor], { model: person });
    
    // defaults
    assert.equal(1, tardis.models.length);
    assert.eql(person, tardis.model);
    
    var spy = new sherlock.spy();
    
    tardis.once('add', spy);
    tardis.add(companion);
    
    this.on('exit', function() {
      assert.equal(2, tardis.models.length);
      assert.equal(true, spy.called, 'tardis add event fired');
      assert.equal(1, spy.calls.length, 'tardis add only fired once');
    });
  },
  'collection remove model': function () {
    var person = seed.model.extend({ className: 'Person' });
    
    var doctor = new person({ name: 'who' }),
        companion = new person({ name: 'amy' });
    
    var tardis = new seed.collection([doctor, companion], { model: person });
    
    // defaults
    assert.equal(2, tardis.models.length);
    assert.eql(person, tardis.model);
    assert.eql(companion.collection, tardis);
    
    var bye = new sherlock.spy();
    
    tardis.once('remove', bye);
    tardis.remove(companion); // sadface
    
    this.on('exit', function() {
      assert.equal(1, tardis.models.length, 'doctor travelling alone');
      assert.equal(true, bye.called, 'tardis `remove` event fired');
      assert.equal(1, bye.calls.length, 'tardis `remove` only fired once');
    });
  }
};