var assert = require('assert'),
    seed = require('seed');

var sherlock = require('sherlock');

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
    
    jake.save(function(err) {
      assert.isNull(err);
      assert.type(this, 'object', 'model of correct type');
      assert.equal(this.get('name'), 'jake', 'model has correct attributes');
      assert.equal(true, this instanceof person, 'model is correct instance');
      assert.isDefined(this.uuid);
      assert.isDefined(this.id);
      assert.eql(this, jake);
    });
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
        n = 0;
    
    doctor.save(function (err) {
      n++;
      assert.isNull(err);
      assert.isDefined(this.uuid, 'uuid defined');
      assert.isDefined(this.id, 'id defined upon save');
      assert.equal('who', this.get('name'), 'names still match on save');
      
      var doctor1 = this;
      
      var doctor2 = new seed.model({ id: this.id });
      
      doctor2.fetch(function(err) {
        n++;
        assert.isNull(err);
        assert.isDefined(this.uuid, 'uuid defined');
        assert.isDefined(this.id, 'id defined upon fetch');
        assert.equal(doctor1.id, this.id);
        assert.eql(doctor1._attributes, this._attributes);
      });
      
    });
    
    this.on('exit', function () {
      assert.equal(n, 2, 'all tests completed');
    });
  },
  'model saving and updating': function () {
    var doctor = new seed.model({ name: 'who' }),
        n = 0;
    
    doctor.save(function(err) {
      n++;
      assert.isNull(err);
      assert.isDefined(this.uuid, 'uuid defined');
      assert.isDefined(this.id, 'id defined upon save');
      assert.equal('who', this.get('name'), 'names still match on save');
      
      this.set({ name: 'doctor who' });
      this.save(function (err) {
        n++;
        assert.isNull(err);
        assert.isDefined(this.uuid, 'uuid defined');
        assert.isDefined(this.id, 'id defined upon save');
        assert.equal('doctor who', this.get('name'), 'names still match on save');
      });
    });
    
    this.on('exit', function () {
      assert.equal(n, 2, 'all callbacks completed');
    });
  },
  'model saving and destroy': function () {
    var doctor = new seed.model({ name: 'who' }),
        n = 0;
    
    doctor.save(function (err) {
      n++;
      assert.isNull(err);
      assert.isDefined(this.uuid, 'uuid defined');
      assert.isDefined(this.id, 'id defined upon save');
      assert.equal('who', this.get('name'), 'names still match on save');
      
      var id = this.id;
      
      this.destroy(function(err) {
        n++;
        assert.isNull(err, 'no errors on destroy');
        
        var doctor2 = new seed.model({ id: id });
      
        doctor2.fetch(function(err) {
          n++;
          assert.isDefined(err);
          assert.equal(6, err.code, 'correct callback code for not defined');
        });
      });
      
      
      
    });
      
    this.on('exit', function () {
      assert.equal(n, 3, 'all callbacks fired');
    });
  }
};