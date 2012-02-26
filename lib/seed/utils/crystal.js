// attributes: substack/node-hat
// https://github.com/substack/node-hat

var exports = module.exports = {};

exports.Crystal = function (opts) {
  opts = opts || {};
  this._stack = {};
  this.bits = opts.bits || 128;
  this.base = opts.base || 16;
  this.expandBy = opts.expandBy || 32;
}

exports.Crystal.prototype.get = function (key) {
  return this._stack[key];
}

exports.Crystal.prototype.set = function (key, value) {
  this._stack[key] = value;
  return this;
}

exports.Crystal.prototype.rand = function () {
  var bits = this.bits
    , base = this.base;
  var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
  for (var i = 2; digits === Infinity; i *= 2) {
    digits = Math.log(Math.pow(2,  (bits/i) )) / Math.log(base) * i;
  }
  var rem = digits - Math.floor(digits)
    , res = '';
  for (var i = 0; i < Math.floor(digits); i++) {
    var x = Math.floor(Math.random() * base).toString(base);
    res = x + res;
  }
  if (res) {
    var b = Math.pow(base, rem)
      , x = Math.floor(Math.random() * base).toString(base);
    res = x + res;
  }

  var parsed = parseInt(res, base);
  if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
    return this.rand();
  } else {
    return res;
  }
}

exports.Crystal.prototype.gen = function (obj) {
  var iters = 0;
  do {
    if (iters ++ > 10) this.bits += this.expandBy;
    var id = this.rand();
  } while (Object.hasOwnProperty(this._stack, id));
  this.set(id, obj);
  return id;
}
