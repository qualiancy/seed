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
  'model saving and updating': function () {
    var doctor = new seed.model({ name: 'who' }),
        id, n = 0, v = 0;
    
    var verify1 = function(result) {
      v++;
      assert.equal('object', typeof result);
      assert.equal('who', result.name);
    };
    
    var verify2 = function(result) {
      v++;
      assert.equal('object', typeof result);
      assert.equal('doctor who', result.name);
    };
    
    var updatedoctor = function(id) {
      n++;
      assert.isNotNull(id);
      
      doctor
        .set({ name: 'doctor who' })
        .save()
          .then(verify2, fail);
      
    };
    
    doctor.save()
      .then(verify1, fail)
      .get('id')
        .then(updatedoctor, fail);
      
    
    this.on('exit', function () {
      assert.equal(n, 1, 'getdoctor called once');
      assert.equal(v, 2, 'both verify called');
    });
  },
  'model saving and destroy': function () {
    var doctor = new seed.model({ name: 'who' }),
      n = 0;
    
    var destroy = function () {
      n++;
      doctor.destroy()
        .then(success, fail)
        .then(confirm_delete);
    };
    
    var confirm_delete = function (id) {
      var newdoctor = new seed.model({ id: id });
      n++;
      newdoctor
        .fetch()
        .then(fail, success); //switch because we want it to fail;
    };
    
    doctor.save()
      .then(success, fail)
      .then(destroy);
      
    this.on('exit', function () {
      assert.equal(n, 2, 'both callbacks fired');
    });
  }
};