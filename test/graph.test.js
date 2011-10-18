
var assert = require('assert'),
    Seed = require('..');

var sherlock = require('sherlock');

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
  'graph stores simple models': function () {
    var n = 0;
    
    var person = Seed.Model.extend({
      type: 'person',
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
    
    earth.add('person', {
      name: 'Arthur Dent',
      origin: 'Earth'
    });
    
    earth.add('person', {
      name: 'Ford Prefect',
      origin: 'Betelgeuse-ish'
    });
    
    assert.equal(2, earth.length(), 'Both items added to graph.');
    
  }
};