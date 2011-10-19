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
  
  done();
});

module.exports = investigation;