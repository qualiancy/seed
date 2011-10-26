var tea = require('tea')
  , Type = require('../type');

module.exports = TypeSelect;

function TypeSelect (args) {
  this.args = args || [];
  Type.call(this, 'Select');
}

tea.merge(TypeSelect.prototype, Type.prototype);

TypeSelect.prototype.validate = function (value) {
  return tea.contains(this.args, value);
};