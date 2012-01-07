var Filter = require('./filter');

module.exports = Query;

function Query (query) {
  this.stack = this.parseQuery([], query);
}

Query.prototype.exec = function (data) {
  var res = []
    , datum
    , pass
    , filter
    , el;
  for (var di = 0, dl = data.length; di < dl; di++) {
    datum = data[di];
    pass = true;
    for (var si = 0, sl = this.stack.length; si < sl; si++) {
      filter = this.stack[si];
      el = (filter.path) ? this.getPathValue(filter.path, datum) : datum;
      if (!filter.test.test(el)) pass = false;
    }
    if (pass) res.push(datum);
  }
  return res;
};

Query.prototype.parseQuery = function (stack, query) {
  for (var cmd in query) {
    var qry= {}
      , params = query[cmd];
    if (cmd[0] == '$') {
      qry.test = new Filter(query);
    } else {
      qry.test = new Filter(params);
      qry.path = this.parsePath(cmd);
    }
    stack.push(qry);
  }
  return stack;
};

Query.prototype.parsePath = function (path) {
  var parts = path.split('.').filter(Boolean);
  return parts.map(function (value) {
    var re = /([A-Za-z0-9]+)\[(\d+)\]$/
      , mArr = re.exec(value)
      , val;
    if (mArr) val = { p: mArr[1], i: mArr[2] };
    return val || value;
  });
};

Query.prototype.getPathValue = function (parsed, obj) {
  var tmp = obj
    , res;
  for (var i = 0, l = parsed.length; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if ('object' === typeof part && tmp[part.p]) {
        tmp = tmp[part.p][part.i];
      } else {
        tmp = tmp[part];
      }
      if (i == (l - 1)) res = tmp;
    } else {
      res = undefined;
    }
  }
  return res;
};