
var Hash = require('../../base/hash')
  , Promise = require('../../base/promise');

module.exports = Select;

function Select (traversal, model) {
  this.traversal = traversal;
  this.model = model;
}

Select.prototype.exec = function (model) {
  model = model || this.model;
  var defer = new Promise()
    , hash = new Hash(null, { findRoot: '_attributes' })
    , key = '/' + model.type + '/' + model.id;
  hash.set(key, model)
  defer.resolve(hash);
  return defer.promise;
}
