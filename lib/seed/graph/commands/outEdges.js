
var _ = require('../../utils')
  , Hash = require('../../hash')
  , helper = require('../helpers')
  , Promise = require('../../base/promise');

module.exports = OutEdges;

function OutEdges (traversal) {
  this.traversal = traversal;
  this.rel = null;
}

OutEdges.prototype.exec = function (input) {
  var self = this
    , promise = new Promise()
    , hash = new Hash(null, { findRoot: '_attributes' })
    , queueFn = function (fn, next) { fn(next) }
    , resolved = function (next) { return function () { next() } }
    , rejected = function (err) { promise.reject(err); }
    , queue = new _.Queue(10, queueFn);

  if (this.traversal.flag('live')) {
    input.each(function (model) {
      queue.push(function (next) {
        fetchOutEdges
          .call(self, model)
          .then(resolved(next), rejected);
      });
    });
  }

  queue.push(function (next) {
    input.each(outEdges.call(self, hash));
    next();
  });

  queue.push(function () {
    promise.resolve(hash);
  });

  return promise.promise;
};

function outEdges (hash) {
  var self = this
    , graph = this.traversal.flag('parent');

  return function getOutEdges (model) {
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

function fetchOutEdges (model) {
  var defer = new Promise()
    , graph = this.traversal.flag('parent')
    , rel = this.rel || null;

  helper
    .fetchOutEdges
    .call(graph, model, rel, function (err) {
      if (err) return defer.reject(err);
      defer.resolve();
    });

  return defer.promise;
}
