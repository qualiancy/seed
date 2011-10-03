var assert = require('assert'),
    seed = require('seed');

module.exports = {
  'version exists': function () {
    assert.isNotNull(seed.version);
  },
  'model creation // saving': function () {
    var person = seed.model.extend();
    
    var jake = new person({
      name: 'jake'
    });
    
    var success = function (data) {
      assert.type(jake, 'object', 'model of correct type');
      assert.equal(jake.get('name'), 'jake', 'model has correct attributes');
      assert.equal(true, jake instanceof person, 'model is correct instance');
      assert.isNotNull(jake._mid);
    };
    
    var error = function (msg) {
      assert.fail();
    };
    
    jake.save().then(success, error);
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
  },
  'model save then destroy': function () {
    var doctor = new seed.model({
      name: 'who'
    });
    
    doctor.save().then(function(data) {
      assert.ok(true);
      doctor.destroy().then(function(data) {
        assert.ok(true);
      }, function(err) { assert.fail(err); });
    }, function(err) { assert.fail(err); });
  }
};