var drip = require('drip'),
    utils = require('./utils');

function Store () {
  drip.call(this);
}

utils.merge(Store.prototype, drip.prototype);

Store.prototype.sync = function (action, model) {
  var data = model._attributes,
      path = model.path;
  
  var oath = this[action]({
    data: data,
    path: path || ''
  });
  
  return oath;
};

module.exports = Store;