/*!
 * Attach chai to global should
 */

global.chai = require('chai');
global.should = global.chai.should();

/*!
 * Chai Plugins
 */

global.chai.use(require('chai-spies'));
//global.chai.use(require('chai-http'));

/*!
 * Import project
 */

global.seed = require('../..');

/*!
 * Helper to load internals for cov unit tests
 */

function req (name) {
  return process.env.seed_COV
    ? require('../../lib-cov/seed/' + name)
    : require('../../lib/seed/' + name);
}

/*!
 * Load unexposed modules for unit tests
 */

global.__seed = {

  graph: {
      Edge: req('graph/edge/model')
    , Traversal: req('graph/traversal')
  }
};
