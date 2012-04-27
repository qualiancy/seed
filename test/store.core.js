var should = require('chai').should();

var Seed = require('..')
  , Store = Seed.Store;

var Oath = require('oath');

describe('Store', function () {

  it('should have the proper drip settings', function () {
    var store = new Store();
    store._drip.should.be.a('object');
    store._drip.wildcard.should.be.true;
    store._drip.delimeter.should.equal(':');
    store.emit.should.be.a('function');
  });

  it('should provide a functioning extend method', function () {
    Store.extend.should.be.a('function');
    var NewStore = Store.extend({});
    var store = new NewStore();
    store.should.be.instanceof(Store);
  });

  it('should provide a default sync options', function () {
    var store = new Store();
    store.sync.should.be.a('function');
  });

});
