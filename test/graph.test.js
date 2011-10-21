var sherlock = require('sherlock')
  , assert = sherlock.assert
  , tea = require('tea');

var Seed = require('../lib/seed');

var investigation = new sherlock.Investigation('Seed.Graph', function (test, done) {
  
  test('Seed#version', function (test, done) {
    assert.isNotNull(Seed.version);
    done();
  });
  
  test('Graph#constructor', function (test, done) {
    var n = 0
      , graph = Seed.Graph.extend({
          initialize: function () {
            n++;
          }
        })
      , g = new graph();
    
    this.on('exit', function () {
      assert.equal(1, n, 'all callbacks have been called');
    });
    
    done();
  });
  
  
  test('Graph#add', function (test, done) {
    var n = 0
      , person = Seed.Model.extend('person', {})
      , earth = new Seed.Graph({ models: [ person ] });
    
    var arthur = {
      id: 'arthur',
      name: 'Arthur Dent',
      origin: 'Earth'
    };
    
    var ford = {
      id: 'ford',
      name: 'Ford Prefect',
      origin: 'Betelgeuse-ish'
    };
    
    var success = function (err, data) {
      n++;
      test('item added - ' + data.id, function (test, done) {
        assert.isNull(err);
        assert.isNotNull(data);
        done();
      });
    };
    
    var fail = function (err, data) {
      n++;
      test('item not added when model not available', function (test, done) {
        assert.isNotNull(err);
        assert.isNull(data);
        done();
      });
    };
    
    earth.on('new:person', function (person) {
      n++;
      test('event#new:person valid - ' + person.id, function (test, done) {
        assert.isNotNull(person);
        assert.ok(tea.isType(person, 'person'));
        done();
      });
    });
    
    earth.add('person', arthur, success);
    earth.add('person', ford, success);
    earth.add('alien', ford, fail);
    
    this.on('exit', function () {
      assert.equal(2, earth.length(), 'Both items added to graph.');
      assert.equal(n, 5, 'All callbacks fired');
    });
    
    done();
  });
  
  test('Graph#remove', function (test, done) {
    var person = Seed.Model.extend('person', {
      schema: {
        name: {
          type: String,
          unique: true
        },
        origin: String
      }
    });
    
    var earth = new Seed.Graph({
      models: [ person ]
    });
    
    var arthur = {
      id: 'arthur',
      name: 'Arthur Dent',
      origin: 'Earth'
    };
    
    test('Graph#add - person has been added', function (test, done) {
      earth.add('person', arthur, function (err, data) {
        assert.isNull(err);
        assert.isNotNull(data);
        assert.equal(data.id, arthur.id);
        
        test('Graph#get - person can be retrieved', function (test, done) {
          earth.get('/person/arthur', function (err, person) {
            assert.isNull(err);
            assert.isNotNull(person);
            assert.equal(earth._models.length, 1, 'model has been removed');
            assert.equal(person.id, arthur.id, 'retrieved person has correct id');
            assert.equal(person.get('name'), arthur.name, 'retrieved person has correct name');
            
            test('Graph#remove - person can be removed - w/events', function (test, done) {
              var spy = sherlock.Spy(function(address) {
                assert.isNotNull(address);
                assert.equal(address, '/person/arthur');
              });
              
              earth.on('remove', spy);
              
              earth.remove('/person/arthur', function (err) {
                assert.isNull(err, 'no error on remove');
                assert.equal(earth._models.length, 0, 'model has been removed');
                earth.get('/person/arthur', function (err, person) {
                  assert.isNull(err);
                  assert.isNull(person, 'person wasn\'t found so null returned');
                  done();
                });
              });
              
              this.on('exit', function () {
                assert.equal(spy.calls.length, 1, 'remove event has been called');
              });
              
            });
            
            done();
          });
        });
        done();
      });
    });
    
    
    test('person who has not been added cannot be retrieved', function (test, done) {
      earth.get('/person/ford', function (err, person) {
        assert.isNull(err);
        assert.isNull(person);
        done();
      });
    });
    
    test('person who has not been added cannot be removed', function (test, done) {
      earth.remove('/person/ford', function (err) {
        assert.isNull(err);
        done();
      });
    });
    
    done();
  });
  
  done();
});

module.exports = investigation;