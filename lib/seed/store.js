/*!
 * Seed :: Storage
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var Promise = require('./promise')
  , util = require('util');

/*!
 * Seed component dependacies
 */

var _ = require('./utils')
  , EventEmitter = require('./events')
  , SeedError = require('./error');

/*!
 * Main exports
 */

module.exports = Store;

/**
 * # Store (constructor)
 *
 * The default store template that can be extended
 * by storage engines. Declares default sync option.
 *
 * Options are passed through to underlying engine.
 *
 * @api public
 */

function Store (options) {
  EventEmitter.call(this);

  checkVersion.call(this);
  this.initialize(options);
}

/**
 * Provide a way to extend Store
 */

Store.extend = _.extend;

/*!
 * Merge with `drip` event emitter.
 */

util.inherits(Store, EventEmitter);

/**
 * # .initialize()
 *
 * Default initialize function called on construction.
 * Alternative storage methods should replace this.
 *
 * @api public
 */

Store.prototype.initialize = function () {};

/**
 * # .sync()
 *
 * The default store template that can be extended
 * by storage engines. Declares default sync option.
 *
 * @param {String} action (get | set | destroy)
 * @param {Object} model instance of seed.model
 * @api public
 */

Store.prototype.sync = function (action, model, query) {
  var data = (model) ? model._attributes : null
    , collection = model.type;

  var oath = this[action]({
    data: data,
    collection: collection,
    query: query || {}
  });

  return oath;
};

/*!
 * # .checkVersion()
 *
 * Seed storage engines should provide a MIN_SEED_VERSION
 * variable to ensure compatiblity. This is recommended
 * given the fluctuating nature of Seeds current API and
 * that Seed should not be a dependancy of a storage engine.
 *
 * @api private
 */

function checkVersion () {
  if (this.MIN_SEED_VERSION) {
    var minver = this.MIN_SEED_VERSION
      , pack = require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'package.json'))
      , version = JSON.parse(pack).version
      , name = this.name || 'Storage';
    var ok = require('semver').gte(version, minver);
    if (!ok) {
      throw new SeedError(name + ' minimum seed version requirement not met.', {
          expected: minver
        , actual: version
      });
    }
  }
}
