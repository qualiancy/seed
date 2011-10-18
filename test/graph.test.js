
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
  }
};