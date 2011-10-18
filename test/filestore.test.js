var assert = require('assert')
  , path = require('path')
  , fs = require('fs');
  
var Seed = require('..')
  , FileStore = new Seed.FileStore(path.join(__dirname, 'data'));

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
  'FileStorage creation with nonexisting path errors': function () {
    var _path = path.join(__dirname, 'fake');
    var filestore = function () {
      return new Seed.FileStore(_path);
    };
    
    assert.throws(filestore, /does not exist/);
  },
  'Filestore set/get/destroy': function () {
    var person = Seed.Model.extend({ 
      className: 'Person',
      path: 'people',
      store: FileStore
    });
    
    var arthur = new person({ name: 'arthur dent' });
    
    assert.equal(true, arthur.flag('new'));
    
    //set
    arthur.save(function (err) {
      assert.isNull(err);
      var id = this.id;
      var arthur2 = new person({ id: id });
      
      var file = path.join(__dirname, 'data', 'people', id + '.json')
      var exists = path.existsSync(file);
      assert.equal(true, exists);
        
      //get
      arthur2.fetch(function (err) {
        assert.isNull(err);
        assert.eql(arthur._attributes, arthur2._attributes);
        
        //destroy
        arthur2.destroy(function (err) {
          assert.isNull(err);
          var exists2 = path.existsSync(file);
          assert.equal(false, exists2);
        });
        
      });
      
    });
    
  }
};