
var _ = require('../../../utils')
  , async = require('../../../base/async')
  , Hash = require('../../../base/hash')
  , helper = require('../../helpers')
  , Promise = require('../../../base/promise');

module.exports = Edges;

function Edges (traversal) {
  this.traversal = traversal;
  this.rel = null;
}

Edges.prototype.exec = function (input) {
  var self = this
    , defer = new Promise()
    , graph = this.traversal.flag('parent')
    , hash = new Hash(null, { findRoot: '_attributes' })
    , isLive = this.traversal.flag('live')
    , rel = this.rel || null;

  function push (queue) {
    return function doPush (model) {
      queue.push(model);
    }
  }

  function doFetchEdges (cb) {
    if (!isLive) return cb(null);
    var fetchFn = (self.direction === 'y')
      ? helper.fetchOutEdges
      : helper.fetchInEdges;

    var queue = async.queue(function (model, next) {
      fetchFn.call(graph, model, rel, next);
    }, 10);

    input.each(push(queue));
    if (queue.length === 0) cb(null);
    queue.drain = cb;
    queue.onerror = cb;
    queue.process();
  }

  function doEdgeFilter (cb) {
    var queue = async.queue(function (model, next) {
      edgeFilter.call(self, model, hash, next);
    });

    input.each(push(queue));
    if (queue.length === 0) cb(null);
    queue.drain = cb;
    queue.onerror = cb;
    queue.process();
  }

  async.series([
      doFetchEdges
    , doEdgeFilter
  ], function (err) {
    if (err) return defer.reject(err);
    defer.resolve(hash);
  });

  return defer.promise;
};

function edgeFilter (model, hash, cb) {
  var graph = this.traversal.flag('parent')
    , query = { $and: [ { $or: [] } ] }
    , which = this.direction;

  if (which === 'y') {
    query.$and[0].$or.push({ 'x.id': model.id });
    query.$and[0].$or.push({ 'x.$id': model.id });
  } else {
    query.$and[0].$or.push({ 'y.id': model.id });
    query.$and[0].$or.push({ 'y.$id': model.id });
  }

  if (this.rel) query.$and.push({ 'rel': this.rel });

  graph
    ._edges
    .find(query)
    .each(function (edge) {
      var key = '/' + edge.type + '/' + edge.id;
      hash.set(key, edge);
    });

  // setting up for possible async in near future
  cb(null);
}
