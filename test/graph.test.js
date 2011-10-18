
var assert = require('assert'),
    Seed = require('..');

var sherlock = require('sherlock');

module.exports = {
  'seed#version': function () {
    assert.isNotNull(Seed.version);
  }
};