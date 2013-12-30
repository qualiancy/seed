var inherits = require('super')
  , SeedString = require('./string');

module.exports = Select;

function Select (path, value) {
  this._path = path;
  this._value = value;
  return this;
}

inherits(Select, SeedString);

Select.prototype.validate = function () {
  return this._path.allowed.indexOf(this._value) != -1;
};

Select.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this._value;
};
