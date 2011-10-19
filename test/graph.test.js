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
    var n = 0;
    
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
  
  test('Graph#get', function (test, done) {
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
    
    
    test('person has been added', function (test, done) {
      earth.add('person', arthur, function (err, data) {
        assert.isNull(err);
        assert.isNotNull(data);
        assert.equal(data.id, arthur.id);
        
        test('person can be retrieved', function (test, done) {
          earth.get('/person/arthur', function (err, person) {
            assert.isNull(err);
            assert.isNotNull(person);
            assert.equal(person.id, arthur.id, 'retrieved person has correct id');
            assert.equal(person.get('name'), arthur.name, 'retrieved person has correct name');
            done();
          });
        });
        
        test('person who has not been added cannot be retrieved', function (test, done) {
          earth.get('/person/ford', function (err, person) {
            assert.isNotNull(err);
            done();
          });
        });
        
        done();
      });
    });
    
    
    
    done();
  });
  
  
  done();
});

module.exports = investigation;