var assert = require('assert')
  , path = require('path')
  , fs = require('fs');
  
var Seed = require('..');

var sherlock = require('sherlock');

module.exports = {
  'version exists': function () {
    assert.isNotNull(Seed.version);
  },
  'FileStorage creation without path errors': function () {
    var filestore = function () {
      return new Seed.FileStore();
    };
    
    assert.throws(filestore, /requires path/);
  },
  'FileStorage creation with nonexisting path erros': function () {
    var _path = path.join(__dirname, 'fake');
    var filestore = function () {
      return new Seed.FileStore(_path);
    };
    
    assert.throws(filestore, /does not exist/);
  }
};