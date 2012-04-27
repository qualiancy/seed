
var Hash = require('../../hash')
  , Promise = require('../../base/promise');

module.exports = OutEdges;

function OutEdges (traversal) {
  this.traversal = traversal;
  this.rel = null;
}

OutEdges.prototype.exec = function (input) {
  var promise = new Promise()
    , hash = new Hash(null, { findRoot: '_attributes' });

  input.each(outE.call(this, hash));

  promise.resolve(hash);
  return promise.promise;
};

function outE (hash) {
  var self = this
    , graph = this.traversal.flag('parent');

  return function getOutE (model) {
    var query = { $and:
      [ { $or:
          [ { 'x.id': model.id }
          , { 'x.$id': model.id } ]
      } ]
    };

    if (self.rel)
      query.$and.push({ 'rel': self.rel });

    graph._edges
      .find(query)
      .each(function (edge) {
        var key = '/' + edge.type + '/' + edge.id;
        hash.set(key, edge);
      });
  };
}
