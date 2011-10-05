var assert = require('assert'),
    sherlock = require('sherlock');

var seed = require('seed');

module.exports = {
  'version exists': function () {
    assert.isNotNull(seed.version);
  },
  'collection add model': function () {
    var person = seed.model.extend({ className: 'Person' });
    
    var arthur = new person({ name: 'arthur dent' }),
        ford = new person({ name: 'ford prefect' });
    
    var earth = new seed.collection([arthur], { model: person });
    
    // defaults
    assert.equal(1, earth.models.length);
    assert.eql(person, earth.model);
    
    var spy = new sherlock.spy();
    
    earth.once('add', spy);
    earth.add(ford);
    
    this.on('exit', function() {
      assert.equal(2, earth.models.length);
      assert.equal(true, spy.called, 'earth add event fired');
      assert.equal(1, spy.calls.length, 'earth add only fired once');
    });
  },
  'collection remove model': function () {
    var person = seed.model.extend({ className: 'Person' });
    
    var arthur = new person({ name: 'arthur dent' }),
        ford = new person({ name: 'ford prefect' });
    
    var earth = new seed.collection([arthur, ford], { model: person });
    
    // defaults
    assert.equal(2, earth.models.length);
    assert.eql(person, earth.model);
    assert.eql(ford.collection, earth);
    
    var bye = new sherlock.spy();
    
    earth.once('remove', bye);
    earth.remove(ford); // sadface
    
    this.on('exit', function() {
      assert.equal(1, earth.models.length, 'arthur only remains');
      assert.equal(true, bye.called, 'earth `remove` event fired');
      assert.equal(1, bye.calls.length, 'earth `remove` only fired once');
    });
  }
};