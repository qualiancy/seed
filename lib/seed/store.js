/*!
 * Seed :: Storage
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var inherits = require('super')
  , Promise = require('./base/promise')

/*!
 * Seed component dependacies
 */

var _ = require('./utils')
  , EventEmitter = require('./base/events');

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
  this.initialize(options);
}

/**
 * Provide a way to extend Store
 */

Store.extend = inherits.extend;

/*!
 * Merge with `drip` event emitter.
 */

inherits(Store, EventEmitter);

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

  if (model.schema)
    data = model.schema.getValue(data);

  var promise = this[action]({
      data: data
    , collection: collection
    , query: query || {}
  });

  return promise;
};
