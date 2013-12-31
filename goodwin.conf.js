module.exports = function(config) {
  config.set({
    suite: 'seed',
    globals: {
      Hash: require('./lib/hash').Hash,
      hashFixture: require('./test/.fixtures/countries.json')
    },
    tests: [
      'test/**/*.js'
    ]
  });
};
