module.exports = process.env.SEED_COV
  ? require('./lib-cov/seed')
  : require('./lib/seed');
