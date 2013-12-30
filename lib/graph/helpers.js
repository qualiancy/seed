/*!
 * Seed :: Graph :: Private Helpers
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Seed specific dependancies
 */

var Edge = require('./edge/model')
  , errors = require('../errors/graph')
  , DBRef = require('../schematypes/dbref');

/**
 * # refreshLookups
 *
 * Ensure that the hash of model has all the
 * correct ID lookups.
 *
 * @param {Seed.Hash} hash to refresh
 * @api private
 */

exports.refreshLookups = function (hash) {
  var arr = hash.toArray();
  hash.flush(true);
  for (var i = 0; i < arr.length; i++) {
    var key = '/' + arr[i].value.type + '/' + arr[i].value.id
      , value = arr[i].value;
    hash.set(key, value, true);
  }
};

/**
 * # buildEdge
 *
 * Given two models and relation tag, construct
 * a new Edge model and return it. Must be called
 * with a graph's context.
 *
 * @context {Seed.Graph}
 * @param {Seed.Model|DBRef} vertice x
 * @param {Seed.Model|DBRef} vertice y
 * @param {String} relation tag
 * @param {Object} attributes to attach to edge
 * @returns {Seed.Model} instance of Graph#Edge
 * @api private
 */

exports.buildEdge = function (vertX, vertY, rel, attrs) {
  var type = this.type + '_edge'
    , edge = new Edge({
          x: vertX
        , y: vertY
        , rel: rel
        , attributes: attrs
      }, { parent: this, type: type });
  return edge;
};

/**
 * # getEdge
 *
 * Given two vertices and a relation tag,
 * determine if there is an edge model constructed
 * in a constructed graph's hash of edges. Must be
 * called with the graph's context.
 *
 * @context {Seed.Graph}
 * @param {Seed.Model|DBRef} vertice x
 * @param {Seed.Model|DBRef} vertice y
 * @param {String} relation tag
 * @returns {Seed.Model} instance of Graph#Edge (or undefined)
 * @api private
 */

exports.getEdge = function (vertX, vertY, rel) {
  var x =
    { id: vertX.id || vertX.$id
    , type: vertX.type || vertX.$rel };

  var y =
    { id: vertY.id || vertY.$id
    , type: vertY.type || vertY.$rel };

  return this._edges.find({
    $and:
      [ { $or:
        [ { 'x.id': x.id, 'x.type': x.type }
        , { 'x.$id': x.id, 'x.$rel': x.type } ] }
      , { $or:
        [ { 'y.id': y.id, 'y.type': y.type }
        , { 'y.$id': y.id, 'y.$rel': y.type } ] }
      , { 'rel': rel } ]
  }).at(0);
};

/**
 * # fetchEdges
 *
 * Given a vertices (either x or y), connect to the graph's
 * store and fetch all edges related to that model. The vertice
 * can either be a constructed model or a DBRef object. The fetch
 * can further be filtered by the relation tag. All fetched edges
 * will be constructed into an Edge model and placed in the graph's
 * hash of edges. Must be called with the graph's context.
 *
 * @context {Seed.Graph}
 * @param {Seed.Model|DBRef} vertice (can be x or y)
 * @param {String} relation tag (optional)
 * @param {Function} callback to execute on completion
 * @cbparam {Object} error if issue with fetch or parse
 * @api private
 */

exports.fetchEdges = function (vert, rel, cb) {
  if ('function' === typeof rel) {
    cb = rel;
    rel = null
  }

  // query builder
  var query = { $and:
    [ { $or:
      [ { 'x.$id': vert.id
        , 'x.$ref': vert.type }
      , { 'y.$id': vert.id
        , 'y.$ref': vert.type }
      ] }
    ]
  };

  if (rel && 'string' === typeof rel)
    query.$and.push({ 'rel': rel });

  pullEdges.call(this, query, cb);
};

/**
 * # fetchOutEdges
 *
 * Same as `fetchEdges` execept expects vertice supplied
 * to be the `x` vertice in the edge.
 *
 * @context {Seed.Graph}
 * @param {Seed.Model|DBRef} x vertice
 * @param {String} relation tag (optional)
 * @param {Function} callback to execute on completion
 * @cbparam {Object} error if issue with fetch or parse
 * @api private
 */

exports.fetchOutEdges = function (vert, rel, cb) {
  // check for rel param
  if ('function' === typeof rel) {
    cb = rel;
    rel = null
  }

  // query builder
  var query = {
      'x.$id': vert.id
    , 'x.$ref': vert.type
  };

  if (rel && 'string' === typeof rel)
    query.rel = rel;

  pullEdges.call(this, query, cb);
};

/**
 * # fetchInEdges
 *
 * Same as `fetchEdges` execept expects vertice supplied
 * to be the `y` vertice in the edge.
 *
 * @context {Seed.Graph}
 * @param {Seed.Model|DBRef} y vertice
 * @param {String} relation tag (optional)
 * @param {Function} callback to execute on completion
 * @cbparam {Object} error if issue with fetch or parse
 * @api private
 */

exports.fetchInEdges = function (vert, rel, cb) {
  // check for rel param
  if ('function' === typeof rel) {
    cb = rel;
    rel = null
  }

  // query builder
  var query = {
      'y.$id': vert.id
    , 'y.$ref': vert.type
  };

  if (rel && 'string' === typeof rel)
    query.rel = rel;

  pullEdges.call(this, query, cb);
};

/*!
 * # pullEdges
 *
 * Powers `fetchEdges` and equivalant helper methods.
 * Performs a query on the storage engine.
 *
 * @context {Seed.Graph}
 * @param {Object} query
 * @param {Function} callback
 * @api double-secret
 */

function pullEdges (query, cb) {
  // base checks and reassociation
  if (!this.store) return cb(errors.create('no store'));

  // empty callback
  if ('function' !== typeof cb)
    cb = function () {};

  // variables
  var self = this
    , type = this.type + '_edge';

  // given array fetched, load edges into graph
  function parseEdges (data) {
    for (var i = 0; i < data.length; i++) {
      var rawEdge = data[i]
        , rawX = new DBRef(null, rawEdge.x).getValue()
        , rawY = new DBRef(null, rawEdge.y).getValue()
        , vertX = (self.has(rawX.$ref, rawX.$id))
          ? self.get(rawX.$ref, rawX.$id)
          : rawX
        , vertY = (self.has(rawY.$ref, rawY.$id))
          ? self.get(rawY.$ref, rawY.$id)
          : rawY
        , edge = exports.getEdge.call(self, vertX, vertY, rawEdge.rel);

      if (!edge) {
        edge = exports.buildEdge.call(self, vertX, vertY, rawEdge.rel, rawEdge.attributes);
        edge.set('_id', rawEdge._id, { silent: true });
        edge.flag('new', false, true);
        edge.flag('dirty', false, true);
        self._edges.set(edge.id, edge);
      }
    }

    exports.refreshLookups.call(self, self._edges);
    cb(null);
  }

  // begin the query
  this.store
    .sync('fetch', { type: type }, query)
    .then(parseEdges, function rejected (err) { cb(err) });
}
