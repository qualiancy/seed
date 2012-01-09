/*!
 * seed - storage
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var Drip = require('drip')
  , Oath = require('oath')
  , _ = require('./utils')
  , SeedError = require('./error');

var fs = require('fs')
  , join = require('path').join
  , semver = require('semver');

/*!
 * Main exports
 */

module.exports = Store;

/**
 * # Store
 *
 * The default store template that can be extended
 * by storage engines. Declares default sync option.
 *
 * @api prototype
 */

function Store (options) {
  Drip.call(this, { delimeter: ':' });
  this.Promise = Oath;
  this.checkVersion();
  this.initialize(options);
}

/**
 * Provide a way to extend Store
 */

Store.extend = _.extend;

/*!
 * Merge with `drip` event emitter.
 */

Store.prototype.__proto__ = Drip.prototype;

/**
 * # .initialize()
 *
 * Default initialize function called on construction.
 * Alternative storage methods should replace this.
 * @api public
 */

Store.prototype.initialize = function () {};

/**
 * # .checkVersion()
 */

Store.prototype.checkVersion = function () {
  if (this.MIN_SEED_VERSION) {
    var minver = this.MIN_SEED_VERSION
      , pack = fs.readFileSync(join(__dirname, '..', '..', 'package.json'))
      , version = JSON.parse(pack).version
      , name = this.name || 'Storage';
    var ok = semver.gte(version, minver);
    if (!ok) {
      throw new SeedError(name + ' minimum seed version requirement not met.', {
          expected: minver
        , actual: version
      });
    }
  }
};

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