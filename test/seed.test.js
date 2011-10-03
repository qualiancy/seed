var assert = require('assert'),
    seed = require('seed');



module.exports = {
  'version exists': function() {
    assert.isNotNull(seed.version);
  },
  'basic constructor': function() {
    var plant = seed.extend({
      name: 'maple',
      season: function(str) {
        return str;
      }
    });
    
    var maple = new plant();
    
    assert.equal('maple', maple.name);
    assert.equal('winter', maple.season('winter'));
  },
  'basic constructor initialize function': function() {
    var plant = seed.extend({
      initialize: function (arg1, arg2) {
        this.name = arg1;
        this.season = arg2;
      },
      get: function (prop) {
        return this[prop];
      }
    });
    
    var tree = new plant('hemlock', 'spring');
    
    assert.equal('hemlock', tree.get('name'));
    assert.equal('spring', tree.get('season'));
  },
  'basic extended constructor': function() {
    var plant = seed.extend({
      initialize: function (arg1, arg2) {
        this.name = arg1;
        this.season = arg2;
      },
      get: function (prop) {
        return this[prop];
      }
    });
    
    var tree = seed.extend(plant, {
      type: 'tree',
      title: 'tree'
    });
    
    var hemlock = seed.extend(tree, {
      title: 'hemlock'
    });
    
    var hemmy = new hemlock('hemmy', 'summer');
    
    assert.equal('function', typeof hemmy.get);
    assert.equal('hemmy', hemmy.get('name'));
    assert.equal('summer', hemmy.get('season'));
    assert.equal('hemlock', hemmy.title);
    assert.equal('tree', hemmy.type);
  },
  'multiple extended constructor': function() {
    var plant = seed.extend({
      initialize: function (arg1, arg2) {
        this.name = arg1;
        this.season = arg2;
      },
      get: function (prop) {
        return this[prop];
      }
    });
    
    var tree = seed.extend({
      type: 'tree',
      title: 'tree'
    });
    
    var hemlock = seed.extend(plant, tree, {
      title: 'hemlock'
    });
    
    var hemmy = new hemlock('hemmy', 'summer');
    
    assert.equal('function', typeof hemmy.get);
    assert.equal('hemmy', hemmy.get('name'));
    assert.equal('summer', hemmy.get('season'));
    assert.equal('hemlock', hemmy.title);
    assert.equal('tree', hemmy.type);
  },
  'multipe extended constructor of objects': function() {
    var plant = seed.extend({
      initialize: function (arg1, arg2) {
        this.name = arg1;
        this.season = arg2;
      },
      get: function (prop) {
        return this[prop];
      },
      toString: function() {
        return '[Plant ' + this.name + ']';
      }
    });
    
    var tree = {
      type: 'tree',
      title: 'tree'
    };
    
    var hemlock = seed.extend(plant, tree, {
      title: 'hemlock'
    });
    
    var hemmy = new hemlock('hemmy', 'summer');
    
    assert.equal('function', typeof hemmy.get);
    assert.equal('hemmy', hemmy.get('name'));
    assert.equal('summer', hemmy.get('season'));
    assert.equal('hemlock', hemmy.title);
    assert.equal('tree', hemmy.type);
    assert.equal('[Plant hemmy]', hemmy.toString());
  },
  'throws error on bad constructor': function () {
    var create = function() {
      return seed.extend(['test']);
    };
    
    assert.throws(create, Error);
  }
};