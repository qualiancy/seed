/*!
 * seed - storage
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var drip = require('drip'),
    tea = require('tea');

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

tea.merge(Store.prototype, drip.prototype);

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

Store.prototype.sync = function (action, model) {
  var data = (model) ? model._attributes : null,
      path = model.path || model.collection.path;
  
  var oath = this[action]({
    data: data,
    path: path || ''
  });
  
  return oath;
};

module.exports = Store;