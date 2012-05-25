
var _ = require('../../utils')
  , Edge = require('../edge/model')
  , Hash = require('../../hash')
  , helper = require('../helpers')
  , Promise = require('../../base/promise');

module.exports = OutVertices;

function OutVertices (traversal) {
  this.traversal = traversal;
  this.rel = null;
}

OutVertices.prototype.exec = function (input) {
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
        fetchOutVertices
          .call(self, model)
          .then(resolved(next), rejected);
      });
    });
  }

  queue.push(function (next) {
    input.each(outV.call(self, hash, next));
  });

  queue.push(function () {
    promise.resolve(hash);
  });

  return promise.promise;
};

function outV (hash, cb) {
  var self = this
    , graph = this.traversal.flag('parent');

  return function getOutV (model) {
    if (model instanceof Edge)
      return getEdgeV.call(self, hash, cb)(model);

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
      .each(getEdgeV.call(self, hash, cb));
  };
}

function getEdgeV (hash, cb) {
  var live = this.traversal.flag('live');

  function setHash(edge) {
    var vert = edge.get('y')
      , key = '/' + vert.type + '/' + vert.id;
    hash.set(key, vert);
    cb(null);
  }

  return function (edge) {
    if (live) {
      edge.loadY(function (err) {
        if (err) return cb(err);
        setHash(edge);
      });
    } else {
      setHash(edge);
    }
  };
}

function fetchOutVertices (model) {
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
