var Filter = require('../helpers/filter');

module.exports = Query;

var eyes = require('eyes');

var traversable = {
    $and: true
  , $or: true
  , $nor: true
}


function Query (raw) {
  this.raw = raw;
  this.stack = [];
  this.parse(this.stack, this.raw);
}

Query.prototype.parse = function (stack, query) {
  for (var test in query) {
    var fn = Filter[test]
      , params = query[test]
      , traverse = false;
    if (traversable[test]) {
      var s = [];
      this.traverse(s, params);
      params = s;
      traverse = true;
    }
    stack.push({
        fn: fn
      , params: params
      , traverse: traverse
    });
  }
};

Query.prototype.traverse = function (stack, params) {
  for (var i = 0; i < params.length; i++) {
    var query = params[i]
      , s = [];
    this.parse(s,query);
    stack.push(s);
  }
};

Query.prototype.test = function (val) {
  return this.testStack(val, this.stack);
};

Query.prototype.traverseStack = function (val, stack) {
  var res = [];
  for (var i = 0; i < stack.length; i++) {
    var test = stack[i];
    res.push(this.testStack(val, test));
  }
  return res;
};

Query.prototype.testStack = function (val, stack) {
  var res = true;
  for (var i = 0; i < stack.length; i++) {
    var test = stack[i]
      , params = test.params;
    if (test.traverse) {
      params = this.traverseStack(val, test.params);
    }
    if (test.fn.length == 1) {
      if (!test.fn(params)) res = false;
    } else {
      if (!test.fn(val, params)) res = false;
    }
  }
  return res;
};

