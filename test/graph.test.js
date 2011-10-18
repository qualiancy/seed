
var assert = require('assert'),
    tea = require('tea'),
    Seed = require('..');

var sherlock = require('sherlock')
  , inspect = require('eyes').inspector({ maxLength: 10240 });

module.exports = {
  'seed#version': function () {
    assert.isNotNull(Seed.version);
  },
  'graph#constructor': function () {
    var n = 0;
    
    var graph = Seed.Graph.extend({
      initialize: function () {
        n++;
      }
    });
    
    var g = new graph();
    
    this.on('exit', function () {
      assert.equal(1,n, 'all callbacks have been called');
    });
  },
  'graph stores simple models, emits events': function () {
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
      assert.isNull(err);
      assert.isNotNull(data);
    };
    
    var fail = function (err, data) {
      n++;
      assert.isNotNull(err);
      assert.isNull(data);
    }
    
    earth.on('new:person', function (person) {
      n++;
      assert.isNotNull(person);
      assert.ok(tea.isType(person, 'person'));
    });
    
    earth.add('person', arthur, success);
    earth.add('person', ford, success);
    
    earth.add('alien', ford, fail);
    
    inspect(earth);
    
    
    
    this.on('exit', function () {
      assert.equal(2, earth.length(), 'Both items added to graph.');
      assert.equal(5, n, 'All callbacks fired');
    });
    
  }
};