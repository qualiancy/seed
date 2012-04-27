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

  for (i === 0; i < arr.length; i++) {
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
