
var _ = require('../../../utils')
  , async = require('../../../base/async')
  , Edge = require('../../edge/model')
  , Hash = require('../../../hash')
  , helper = require('../../helpers')
  , Promise = require('../../../base/promise');

module.exports = Vertices;

function Vertices (traversal) {
  this.traversal = traversal;
  this.rel = null;
}

Vertices.prototype.exec = function (input) {
  var self = this
    , defer = new Promise()
    , graph = this.traversal.flag('parent')
    , rel = this.rel || null
    , hash = new Hash(null, { findRoot: '_attributes' })
    , isLive = this.traversal.flag('live');

  function push (queue) {
    return function doPush(model) {
      queue.push(model);
    }
  }

  function doFetchEdges (cb) {
    if (!isLive) return cb(null);
    var fetchFn = (self.direction === 'y')
        ? helper.fetchOutEdges
        : helper.fetchInEdges;

    var queue = async.queue(function (mod, next) {
      fetchFn.call(graph, mod, rel, next);
    }, 10);

    input.each(push(queue));
    queue.drain = cb;
    queue.onerror = cb;
    queue.process();
  }

  function doFetchVertices (cb) {
    var queue = async.queue(function (mod, next) {
      fetchVertices.call(self, mod, hash, next);
    }, 10);

    input.each(push(queue));
    queue.drain = cb;
    queue.onerror = cb;
    queue.process();
  }

  async.series([
      doFetchEdges
    , doFetchVertices
  ], function (err) {
    if (err) return defer.reject(err);
    defer.resolve(hash);
  });

  return defer.promise;
};

function fetchVertices (model, hash, cb) {
  if (model instanceof Edge)
    return loadVertice.call(this, hash)(model, cb);

  var graph = this.traversal.flag('parent')
    , query = { $and: [ { $or: [] } ] }
    , queue = new async.queue(loadVertices.call(this, hash), 10)
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
    .each(function (model) {
      queue.push(model);
    });

  queue.drain = cb;
  queue.onerror = cb;
  queue.process();
};

function loadVertices (hash) {
  var which = this.direction
    , isLive = this.traversal.flag('live');

  return function iterator (edge, next) {
    function setHash () {
      var vert = edge.get(which)
        , key = '/' + vert.type + '/' + vert.id;
      hash.set(key, vert);
      next(null);
    }

    if (!isLive) return setHash()
    edge.load(function (err) {
      if (err) return next(err);
      setHash();
    });
  }
}
