var assert = require('assert'),
    seed = require('seed');

module.exports = {
  'version exists': function () {
    assert.isNotNull(seed.version);
  },
  'model creation': function () {
    var person = seed.model.extend();
    
    var jake = new person({
      name: 'jake'
    });
    
    jake.save();
    
    assert.type(jake, 'object', 'model of correct type');
    assert.eql(jake.attributes, { name: 'jake' }, 'model has correct attributes');
    assert.equal(true, jake instanceof person, 'model is correct instance');
    assert.isNotNull(jake._mid);
  },
  'models have events': function () {
    var person = seed.model.extend(),
        n = 0, changed;
    
    var jake = new person({
      name: 'jake',
      big: {
        complicated: 'word'
      }
    });
    
    jake.on('testing', function() {
      n++;
    });
    
    jake.on('change:name', function (data) {
      n++;
      changed = data;
    });
    
    setTimeout(function() {
      jake.set({ name: 'doctor who' });
      jake.set({ name: 'the doctor'}, { silent: true }); // should not call event
      jake.emit('testing');
      jake.save({ silent: true });
    }, 200);
    
    this.on('exit', function () {
      assert.equal(n, 2, 'event has successfully executed callback');
      assert.eql(changed, { attribute: 'name', previous: 'jake', current: 'doctor who' });
    });
  }
};