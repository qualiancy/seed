var Seed = require('..')
  , Query = Seed.Query;

var dataSimple = [
    2342342
  , 43566
  , 3253457
];

var dataComplex = [
    {
      a: {
          b: 100
      }
    , c: 'testC'
    , d: [
        { e: 'world' }
      ]
    }

  , {
      a: {
          b: 50
      }
    , c: 'testC'
    , d: [
        { e: 'universe' }
      ]
    }
];

var querySimple= { $gt: 50000 };
var queryComplex = { 'a.b': { $gt: 75, $lt: 125 } };
var querySuper = { 'a.b': { $gt: 25, $lt: 75 }, 'd[0].e': { $eq: 'universe' } };

var Q1 = new Query(dataSimple, querySimple, { debug: true })
  , R1 = Q1.exec();
console.log(R1);

var Q2 = new Query(dataComplex, queryComplex, { debug: true })
  , R2 = Q2.exec();
console.log(R2);

var Q3 = new Query(dataComplex, querySuper, { debug: true })
  , R3 = Q3.exec();
console.log(R3);
