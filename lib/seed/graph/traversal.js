
var util = require('util');

var _ = require('../utils')
  , EventEmitter = require('../base/events')
  , Hash = require('../hash');

var Command = require('./commands');

module.exports = Traversal;

function Traversal (options) {
  // setup
  EventEmitter.call(this);
  options = options || {};

  // config
  this.parent = options.parent;
  this.stack = [];
  this.palette = new Hash(null, { findRoot: '_attributes' });
}

util.inherits(Traversal, EventEmitter);

Traversal.prototype.exec = function (cb) {
  var self = this
    , stack = this.stack;

  function error (err) {
    cb(err);
  }

  function done (res) {
    cb(null, res);
  }

  function next (i, last) {
    var promise = stack[i];
    promise
      .exec(last)
      .then(
          function fullfilled (res) {
            i++;
            if (!stack[i]) return done(res);
            next(i, res);
          }
        , error
      );
  }

  next(0);
};

function addCommand (cmd, opts) {
  var command = new Command[cmd](this, opts);
  this.stack.push(command);
  return command;
}

Traversal.prototype.select = function (obj) {
  addCommand.call(this, 'select', obj);
  return this;
};

Traversal.prototype.find = function (query) {

};

Object.defineProperty(Traversal.prototype, 'out',
  { get: function () {
      var cmd = addCommand.call(this, 'outVertices');

      var addRelation = function (rel) {
        cmd.rel = rel;
        return this;
      }

      addRelation.__proto__ = this;
      return addRelation;
    }
});

Object.defineProperty(Traversal.prototype, 'outE',
  { get: function () {
      var cmd = addCommand.call(this, 'outEdges');

      var addRelation = function (rel) {
        cmd.rel = rel;
        return this;
      }

      addRelation.__proto__ = this;
      return addRelation;
    }
});

Object.defineProperty(Traversal.prototype, 'in',
  { get: function () {
      var cmd = addCommand.call(this, 'inVertices');

      var addRelation = function (rel) {
        cmd.rel = rel;
        return this;
      }

      addRelation.__proto__ = this;
      return addRelation;
    }
});

Object.defineProperty(Traversal.prototype, 'inE',
  { get: function () {
      var cmd = addCommand.call(this, 'inEdges');

      var addRelation = function (rel) {
        cmd.rel = rel;
        return this;
      }

      addRelation.__proto__ = this;
      return addRelation;
    }
});
