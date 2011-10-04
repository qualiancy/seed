var assert = require('assert'),
    seed = require('seed');

var success = function(data) {
  assert.ok(true);
};

var fail = function(err) {
  assert.fail(err);
};

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
      big: { complicated: 'word' }
    });
    
    jake.on('testing', function() { n++; });
    jake.on('change:name', function (data) { n++; changed = data; });
    
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
  'model saving and reading': function () {
    var doctor = new seed.model({ name: 'who' }),
        id, n = 0, v = 0;
    
    var verify = function(result) {
      v++;
      assert.equal('object', typeof result);
      assert.equal('who', result.name);
    };
    
    var getdoctor = function(id) {
      n++;
      assert.isNotNull(id);
      
      var doctor2 = new seed.model({ id: id });
      doctor2.fetch()
        .then(verify, fail);
      
    };
    
    doctor.save()
      .then(success, fail)
      .get('id')
        .then(getdoctor, fail)
        .pop()
      .then(verify, fail);
    
    this.on('exit', function () {
      assert.equal(n, 1, 'getdoctor called once');
      assert.equal(v, 2, 'verify called twice');
    });
  },
  'model saving and destroy': function () {
    var doctor = new seed.model({ name: 'who' });
    
    doctor.save().then(function(data) {
      console.log(data);
      assert.ok(true);
      doctor.destroy().then(function(data) {
        assert.ok(true);
      }, fail);
    }, fail);
  }
};