
var _ = require('../../utils')
  , Hash = require('../../hash')
  , helper = require('../helpers')
  , Promise = require('../../base/promise');

module.exports = InEdges;

function InEdges (traversal) {
  this.traversal = traversal;
  this.rel = null;
}

InEdges.prototype.exec = function (input) {
  var self = this
    , promise = new Promise()
    , hash = new Hash(null, { findRoot: '_attributes' })
    , queueFn = function (fn, next) { fn(next) }
    , queue = new _.Queue(10, queueFn)
    , resolved = function (next) {
        return function () { next(); }
      }
    , rejected = function (err) {
        queue.cancel();
        promise.reject(err);
      };

  if (this.traversal.flag('live')) {
    input.each(function (model) {
      queue.push(function (next) {
        fetchInEdges
          .call(self, model)
          .then(resolved(next), rejected);
      });
    });
  }

  queue.push(function (next) {
    input.each(inEdges.call(self, hash));
    next();
  });

  queue.push(function () {
    promise.resolve(hash);
  });

  return promise.promise;
};

function inEdges (hash) {
  var self = this
    , graph = this.traversal.flag('parent');

  return function getInEdges (model) {
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
      .each(function (edge) {
        var key = '/' + edge.type + '/' + edge.id;
        hash.set(key, edge);
      });
  };
}

function fetchInEdges (model) {
  var defer = new Promise()
    , graph = this.traversal.flag('parent')
    , rel = this.rel || null;

  helper
    .fetchInEdges
    .call(graph, model, rel, function (err) {
      if (err) return defer.reject(err);
      defer.resolve();
    });

  return defer.promise;
}
