exports.series = function (arr, iterator, done) {
  function iterate (i) {
    iterator(arr[i], i, function next () {
      if (i === arr.length - 1)
        return done();
      iterate(++i);
    });
  };

  iterate(0);
};

exports.parallel = function (arr, iterator, done) {
  var count = 0;

  for (var i = 0; i < arr.length; i++) {
    iterator(arr[i], i, function next () {
      if (++count === arr.length)
        return done();
    });
  }
};

exports.concurrent = function (arr, concurrent, iterator, done) {
  var active = 0
    , count = arr.length;

  function iterate (i) {
    active++;
    iterator(arr[i], i, function next () {
      --count || done();
      if (count > 1 && --active < concurrent)
        iterate(count);
    });
  }

  var max = (arr.length < concurrent) ? arr.length : concurrent;
  for (var i = 0; i < max; i++) iterate(i);
};

exports.Queue = function (concurrent, iterator) {
  if ('function' === typeof concurrent) {
    iterator = concurrent;
    concurrent = 1;
  }

  this._started = false;
  this._cancelled = false;
  this._active = 0
  this._concurrent = concurrent;
  this._iterator = iterator;
  this._callback = null;
  this._retErr = null;
  this._stack = [];
};

exports.Queue.prototype.push = function (obj) {
  this._stack.push(obj);
  iterateQueue.call(this);
};

exports.Queue.prototype.cancel = function () {
  this._cancelled = true;
};

exports.Queue.prototype.start = function (cb) {
  if (cb && 'function' == typeof cb)
    this._callback = cb;
  this._started = true;
  if (this._stack.length === 0 && this._callback)
    return this._callback(null);
  iterateQueue.call(this);
};

function iterateQueue () {
  if (this._stack.length === 0
  || !this._started
  || this._active === this._concurrent)
    return;

  var self = this
    , obj = this._stack.splice(0, 1)[0];

  this._active++;
  this._iterator(obj, function next (err) {
    if (err && !self.retErr) self.retErr = err;
    if (self._cancelled) {
      if (self._callback) self._callback(self.retErr);
      return;
    }
    if (--self._active < self._concurrent) {
      iterateQueue.call(self);
      if (!self._stack.length && self._active == 0 && self._callback) {
        self._callback(self.retErr);
        self._callback = null;
      }
    }
  });
}
