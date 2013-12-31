test('returns new hash map/reduced', function() {
  var h = new Hash(hashFixture)

  function mapFn(key, value, emit) {
    var firstLetter = key[0].toUpperCase();
    emit(firstLetter, value);
  }

  function reduceFn(key, values) {
    var res = 0;
    values.forEach(function(v) { res += v; });
    return res;
  }

  var result = h.mapReduce(mapFn, reduceFn);

  result.should.be.instanceof(Hash);
  result.should.have.property('_data')
    .to.deep.equal({
       A: 164634460,
       B: 499541913,
       C: 1612921712,
       D: 16332279,
       E: 201923164,
       F: 71801966,
       G: 153667627,
       H: 34962898,
       I: 1616633286,
       J: 135946476,
       K: 139914902,
       L: 29208715,
       M: 265693642,
       N: 235034558,
       O: 3027959,
       P: 387744743,
       Q: 848016,
       R: 172014868,
       S: 286525125,
       T: 243917984,
       U: 492263162,
       V: 118519363,
       W: 3091113,
       Y: 24133492,
       Z: 25965640
    });
});
