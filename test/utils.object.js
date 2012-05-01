var chai = require('chai')
  , should = chai.should();

var Seed = require('..');

describe('Object Utilities', function () {

  describe('deepMerge', function () {
    var dm = Seed.utils.deepMerge;

    it('should work for simple objects', function () {
      var a = {
          foo: 'bar'
        , baz: {
            bing: 'beep'
          }
      };

      var b = {
          foo: 'zoo'
        , baz: {
            you: 'too'
          }
      };

      var c = dm(a, b);
      c.should.eql({
          foo: 'zoo'
        , baz: {
              bing: 'beep'
            , you: 'too'
          }
      });
    });

    it('should work for arrays', function () {
      var a = [ { 'a': 1 }, 2 ]
        , b = [ { 'b': 3 }, 4 ];

      var c = dm(a, b);
      c.should.eql([
          { a: 1, b: 3 }
        , 2
        , 4
      ]);
    });

    it('should work for nested arrays', function () {
      var a = {
          foo:
            [ { bar: 'baz' }
              , 2
              , { you: 'too' } ]
        , bing: 'beep'
      };

      var b = {
          foo:
            [ { too: 'you' }
            , 4
            , { bing: 'beep' } ]
        , bing: 'bop'
        , beep: 'boop'
      };

      var c = dm(a, b);
      c.should.eql({
          foo:
            [ { bar: 'baz'
              , too: 'you' }
            , 2
            , { you: 'too'
              , bing: 'beep' }
            , 4 ]
          , bing: 'bop'
          , beep: 'boop'
      });
    });

  });
});
