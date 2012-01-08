/*!
 * seed - storage
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var Drip = require('drip')
  , Oath = require('oath')
  , utils = require('./utils');

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
  this.initialize(options);
}

/**
 * Provide a way to extend Store
 */

Store.extend = utils.extend;

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