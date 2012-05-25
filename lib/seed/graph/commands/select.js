
var Hash = require('../../hash')
  , Promise = require('../../base/promise');

module.exports = Select;

function Select (traversal, model) {
  this.traversal = traversal;
  this.model = model;
}

Select.prototype.exec = function (model) {
  model = model || this.model;
  var promise = new Promise()
    , hash = new Hash(null, { findRoot: '_attributes' })
    , key = '/' + model.type + '/' + model.id;
  hash.set(key, model)
  promise.resolve(hash);
  return promise.promise;
}
