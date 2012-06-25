/*!
 * Seed :: Graph :: Traversal Chain API
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var inherits = require('super');

/*!
 * Seed component dependancies
 */

var _ = require('../utils')
  , EventEmitter = require('../base/events')
  , Hash = require('../base/hash');

/*!
 * Graph specific dependancies
 */

var Command = require('./commands');

/*!
 * Main export
 */

module.exports = Traversal;

function Traversal (parent, options) {
  // setup
  EventEmitter.call(this);
  options = options || {};

  // config
  this._stack = [];
  this.flag('parent', parent);

  var live = ('boolean' === typeof options.live) ? options.live : false;
  this.flag('live', live);
}

inherits(Traversal, EventEmitter);

Traversal.prototype.flag = function (key, value, silent) {
  silent = ('boolean' === typeof silent) ? silent : false;
  var self = this
    , flags = this._flags || (this._flags = new Hash());
  if (arguments.length === 1) {
    return flags.get(key);
  } else if (arguments.length > 1 && Array.isArray(key)) {
    key.forEach(function (elem) {
      flags.set(elem, value);
      if (!silent) self.emit([ 'flag', elem ], value);
    });
  } else if (arguments.length > 1) {
    flags.set(key, value);
    if (!silent) this.emit([ 'flag', key ], value);
  }
};

Traversal.prototype.end = function (cb) {
  var self = this
    , stack = this._stack
    , rejected = function (err) { cb(err) }
    , completed = function (result) { cb(null, result); };

  function next (i, last) {
    var promise = stack[i];

    function fulfilled (res) {
      if (!stack[++i]) return completed(res);
      next(i, res);
    }

    promise.exec(last).then(fulfilled, rejected);
  }

  next(0);
};

function addCommand (cmd, opts) {
  var command = new Command[cmd](this, opts);
  this._stack.push(command);
  return command;
};

Traversal.prototype.select = function (obj) {
  addCommand.call(this, 'select', obj);
  return this;
};

Traversal.prototype.find = function (query) {

};

Traversal.prototype.exec = function (fn) {

};

Object.defineProperty(Traversal.prototype, 'out',
  { get: function () {
      var cmd = addCommand.call(this, 'outVertices')
        , addRelation = function (rel) {
            cmd.rel = rel;
            return this;
          }

      addRelation.__proto__ = this;
      return addRelation;
    }
});

Object.defineProperty(Traversal.prototype, 'outE',
  { get: function () {
      var cmd = addCommand.call(this, 'outEdges')
        , addRelation = function (rel) {
            cmd.rel = rel;
            return this;
          }

      addRelation.__proto__ = this;
      return addRelation;
    }
});

Object.defineProperty(Traversal.prototype, 'in',
  { get: function () {
      var cmd = addCommand.call(this, 'inVertices')
        , addRelation = function (rel) {
            cmd.rel = rel;
            return this;
          }

      addRelation.__proto__ = this;
      return addRelation;
    }
});

Object.defineProperty(Traversal.prototype, 'inE',
  { get: function () {
      var cmd = addCommand.call(this, 'inEdges')
        , addRelation = function (rel) {
            cmd.rel = rel;
            return this;
          }

      addRelation.__proto__ = this;
      return addRelation;
    }
});
