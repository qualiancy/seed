var tea = require('tea')
  , drip = require('drip');

module.exports = Type;

function Type (name) {
  drip.call(this);
  
  this.name = name;
}

tea.merge(Type.prototype, drip.prototype);
