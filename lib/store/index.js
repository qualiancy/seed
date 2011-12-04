/*!
 * seed - storage
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var util = require('util')
  , drip = require('drip');

/**
 * # Store
 *
 * The default store template that can be extended
 * by storage engines. Declares default sync option.
 *
 * @api prototype
 */

function Store () {
  drip.call(this);
}

/*!
 * Merge with `drip` event emitter.
 */

util.inherits(Store, drip);

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

module.exports = Store;