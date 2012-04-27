
var Edge = require('../edge/model')
  , Hash = require('../../hash')
  , Promise = require('../../base/promise');

module.exports = InVertices;

function InVertices (traversal) {
  this.traversal = traversal;
  this.rel = null;
}

InVertices.prototype.exec = function (input) {
  var promise = new Promise()
    , hash = new Hash(null, { findRoot: '_attributes' });

  input.each(outV.call(this, hash));
  promise.resolve(hash);
  return promise.promise;
};

function outV (hash) {
  var self = this
    , graph = this.traversal.parent;

  return function getOutV (model) {
    if (model instanceof Edge)
      return getEdgeV.call(this, hash)(model);

    var query = { $and:
      [ { $or:
          [ { 'y.id': model.id }
          , { 'y.$id': model.id } ]
      } ]
    };

    if (self.rel)
      query.$and.push({ 'rel': self.rel });

    graph._edges
      .find(query)
      .each(getEdgeV.call(this, hash));
  };
}

function getEdgeV (hash) {
  return function (edge) {
    var vert = edge.get('x')
      , key = '/' + vert.type + '/' + vert.id;
    hash.set(key, vert);
  };
}
