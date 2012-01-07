var filters = require('./helpers/filters');

module.exports = Filter;

var traversable = {
    $and: true
  , $or: true
  , $nor: true
}

function Filter (raw) {
  this.raw = raw;
  this.stack = [];
  this.parseFilter(this.stack, this.raw);
}

Filter.prototype.parseFilter = function (stack, query) {
  for (var test in query) {
    var fn = filters[test]
      , params = query[test]
      , traverse = false;
    if (traversable[test]) {
      var st = [];
      for (var i = 0; i < params.length; i++) {
        var query = params[i]
          , s = [];
        this.parseFilter(s, query);
        st.push(s);
      }
      params = st;
      traverse = true;
    }
    stack.push({
        fn: fn
      , params: params
      , traverse: traverse
    });
  }
};

Filter.prototype.test = function (val) {
  return this.testFilter(val, this.stack);
};

Filter.prototype.testFilter = function (val, stack) {
  var res = true;
  for (var i = 0; i < stack.length; i++) {
    var test = stack[i]
      , params = test.params;
    if (test.traverse) {
      var p = [];
      for (var ii = 0; ii < params.length; ii++) {
        var t = params[ii];
        p.push(this.testFilter(val, t));
      }
      params = p;
    }
    if (test.fn.length == 1) {
      if (!test.fn(params)) res = false;
    } else {
      if (!test.fn(val, params)) res = false;
    }
  }
  return res;
};

