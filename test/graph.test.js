var Sherlock = require('sherlock')
  , assert = Sherlock.assert
  , tea = require('tea');

var Seed = require('../lib/seed');

module.exports = new Sherlock.Investigation('Seed.Graph', function (test, done) {
  
  var Person = Seed.Model.extend('person', {});
  
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
  
  test('Graph#set', function (test, done) {
    var graph = new Seed.Graph()
      , spy = Sherlock.Spy(function (person) {
          test('valid person - ' + person.id, function (test, done) {
            assert.isNotNull(person);
            assert.ok(tea.isType(person, 'person'));
            done();
          });
        });
    
    graph.define(Person);
    
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
    
    graph.on('add:person:*', spy);
    
    graph.set('/person/arthur', arthur);
    graph.set('/person/ford', ford);
    
    this.on('exit', function () {
      assert.equal(spy.calls.length, 2, 'all events emitted');
      assert.equal(graph.count, 2, 'both items added');
    });
    
    done();
  });
  
  done();
});
