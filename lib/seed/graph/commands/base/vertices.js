
var _ = require('../../../utils')
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
    , isLive = this.traversal.flag('live')
    , retErr = null
    , edgeQueue = []
    , vertQueue = [];

  function errorHandler (next) {
    return function (ex) {
      if (ex && !retErr) retErr = ex;
      next();
    }
  }

  function iterator (fn, i, next) {
    fn(next);
  }

  function doFetchEdges (cb) {
    if (!isLive) return cb(null);
    var fetchFn = (self.direction === 'y')
      ? helper.fetchOutEdges
      : helper.fetchInEdges;
    input.each(function (model) {
      edgeQueue.push(function (next) {
        fetchFn.call(graph, model, rel, errorHandler(next));
      });
    });
    _.concurrent(edgeQueue, 10, iterator, cb);
  }

  function doFetchVertices (cb) {
    input.each(function (model) {
      vertQueue.push(function (next) {
        fetchVertices.call(self, model, hash, errorHandler(next));
      });
    });
    _.concurrent(vertQueue, 10, iterator, cb);
  }

  doFetchEdges(function () {
    if (retErr) return defer.reject(retErr);
    doFetchVertices(function () {
      if (retErr) return defer.reject(retErr);
      defer.resolve(hash);
    });
  });

  return defer.promise;
};

function fetchVertices (model, hash, cb) {
  if (model instanceof Edge) {
    return loadVertice.call(this, hash)(model, function (err) {
      if (err) return cb(err);
      cb(null);
    });
  }

  var graph = this.traversal.flag('parent')
    , which = this.direction
    , query = { $and: [ { $or: [] } ] };

  if (which === 'y') {
    query.$and[0].$or.push({ 'x.id': model.id });
    query.$and[0].$or.push({ 'x.$id': model.id });
  } else {
    query.$and[0].$or.push({ 'y.id': model.id });
    query.$and[0].$or.push({ 'y.$id': model.id });
  }

  if (this.rel)
    query.$and.push({ 'rel': this.rel });

  var queue = new _.Queue(10, loadVertices.call(this, hash));

  graph
    ._edges
    .find(query)
    .each(function (edge) {
      queue.push(edge);
    });

  queue.start(function (err) {
    if (err) return cb(err);
    cb(null);
  });
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
