var assert = require('assert'),
    seed = require('seed'),
    utils = require('utils');

module.exports = {
  'version exists': function() {
    assert.isNotNull(seed.version);
  },
  
  'basic object extends': function() {
    var obj1 = {
      doctor: 'who',
      companion: 'rose',
      tardis: {
        time: 'relative dimension'
      }
    };
    
    var obj2 = {
      companion: 'amy',
      tardis: 'police box'
    };
    
    var obj3 = utils.merge(obj1, obj2);
    assert.eql(obj3, { doctor: 'who', companion: 'amy', tardis: 'police box' });
  }
};