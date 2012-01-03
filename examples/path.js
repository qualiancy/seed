var obj = {
    a: {
        b: 'testB'
    }
  , c: 'testC'
  , d: [
      { e: 'world' }
    ]
};

function getPath (path, obj) {
  var tmp = obj
    , parts = path.split('.').filter(Boolean)
    , res;

  var parsed = parts.map(function (value) {
    var re = /([A-Za-z0-9]+)\[(\d+)\]$/
      , mArr = re.exec(value)
      , val;
    if (mArr) val = { p: mArr[1], i: mArr[2] };
    return val || value;
  });

  while (parsed.length) {
    var part = parsed.splice(0,1)[0];
    if (tmp) {
      if ('object' === typeof part && tmp[part.p]) {
        tmp = tmp[part.p][part.i];
      } else {
        tmp = tmp[part];
      }
      if (!parsed.length) res = tmp;
    } else {
      res = undefined;
    }
  }

  return res;
}

console.log(getPath('a.b', obj)); // 'testB'
console.log(getPath('d[0].e', obj)); // 'world'
console.log(getPath('f[0].g', obj)); // undefined
console.log(getPath('a..b', obj)); // 'testB'