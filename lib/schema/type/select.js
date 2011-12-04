var util = require('util')
  , Type = require('../type');

module.exports = TypeSelect;

function TypeSelect (args) {
  this.args = args || [];
  Type.call(this, 'Select');
}

util.inherits(TypeSelect, Type);

TypeSelect.prototype.validate = function (value) {
  return this.args.indexOf(value) != -1;
};