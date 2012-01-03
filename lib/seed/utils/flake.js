var exports = module.exports = {};

// based on twitter snowflake
exports.Flake = function () {
  this.counter = 0;
  this.last = 0;
};

exports.Flake.prototype.gen = function () {
  var protect = false
    , m = new Date().getTime() - 1262304000000;

  if (this.last >= m) {
    this.counter++;

    if (this.counter == 4095) {
      protect = true;
      this.counter = 0;
      setTimeout(function() {
        arguments.callee;
      }, 1);
    }
  } else {
    this.last = m;
    this.counter = 0;
  }

  if (protect === false) {
    m = m * Math.pow(2, 12);
    var uid = m + this.counter;
    return uid;
  }
};