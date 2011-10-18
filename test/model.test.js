var assert = require('assert'),
    Seed = require('..');

var sherlock = require('sherlock');

var success = function(data) {
  assert.ok(true);
};

var fail = function(err) {
  assert.fail(err);
};

var store = new Seed.MemoryStore();

module.exports = {
  'version exists': function () {
    assert.isNotNull(Seed.version);
  },
  'Model creation // saving': function () {
    var person = Seed.Model.extend();
    
    var jake = new person({
      name: 'jake'
    }, { store: store });
    
    jake.save(function(err) {
      assert.isNull(err);
      assert.type(this, 'object', 'Model of correct type');
      assert.equal(this.get('name'), 'jake', 'Model has correct attributes');
      assert.equal(true, this instanceof person, 'Model is correct instance');
      assert.isDefined(this.uuid);
      assert.isDefined(this.id);
      assert.eql(this, jake);
    });
  },
  'Models have events': function () {
    var person = Seed.Model.extend(),
        n = 0, changed;
    
    var jake = new person({
      name: 'jake',
      big: { complicated: 'word' }
    }, { store: store });
    
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
  'Model saving and reading': function () {
    var doctor = new Seed.Model({ name: 'who' }, { store: store }),
        n = 0;
    
    doctor.save(function (err) {
      n++;
      assert.isNull(err);
      assert.isDefined(this.uuid, 'uuid defined');
      assert.isDefined(this.id, 'id defined upon save');
      assert.equal('who', this.get('name'), 'names still match on save');
      
      var doctor1 = this;
      console.log();
      var doctor2 = new Seed.Model({ id: this.id }, { store: store });
      
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
  'Model saving and updating': function () {
    var doctor = new Seed.Model({ name: 'who' }, { store: store }),
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
  'Model saving and destroy': function () {
    var doctor = new Seed.Model({ name: 'who' }, { store: store }),
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
        
        var doctor2 = new Seed.Model({ id: id }, { store: store });
      
        doctor2.fetch(function(err) {
          n++;
          assert.isDefined(err);
          assert.equal(3, err.code, 'correct callback code for not defined');
        });
      });
      
      
      
    });
      
    this.on('exit', function () {
      assert.equal(n, 3, 'all callbacks fired');
    });
  },
  'Model chaining of actions': function () {
    var doctor = new Seed.Model({ name: 'who' }, { store: store }),
        n = 0;
    
    var fail = function(err) {
      assert.fail(err);
    };
    
    var verify1 = function (id) {
      n++;
      assert.eql(this, doctor, 'correct context');
      assert.equal('doctor who', this.get('name'));
    };
    
    var verify2 = function (data) {
      n++;
      assert.eql(this, doctor, 'correct context');
    };
    
    var verifySave = function (data) {
      n++;
      assert.eql(this, doctor, 'correct context');
      assert.isDefined(this.id, 'made trip to server');
      assert.equal(this.id, doctor.get('id'), 'orig ref updated attributes');
    };
    
    var fetch = function (data) {
      n++;
      assert.eql(this, doctor, 'correct context');
      assert.isNotNull(data);
      
      var new_doctor = new Seed.Model({ id: this.id }, { store: store });
      
      var verifyFetch = function (data) {
        n++;
        assert.eql(this, new_doctor, 'correct context');
      };
      
      var verifyDestroy = function (data) {
        n++;
      };
      
      new_doctor
        .chain()
        .fetch()
          .then(verifyFetch, fail)
          .destroy(verifyDestroy, fail)
            .pop()
          .pop()
        .exec();
    };
    
    var verifyThen = function (data) {
      n++;
      assert.eql(this, doctor, 'correct context');
      assert.isUndefined(data);
    };
    
    
    doctor
      .chain()
      .set({ name: 'doctor who' })
      .then(verify1, fail)
      .get('name', verify2)
      .save(verifySave)
        .serialize(verify2)
        .then(verifyThen, fail)
        .save()
          .then(verifyThen, fail)
          .save()
            .then(verifySave, fail)
            .then(verifyThen, fail)
            .save()
              .then(verifySave, fail)
              .then(fetch, fail)
              .pop()
            .pop()
          .pop()
        .pop()
      .exec();

    
    this.on('exit', function () {
      assert.equal(n, 12, 'all callbacks called');
    });
  }
};