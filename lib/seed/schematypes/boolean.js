var util = require('util');

module.exports = TypeBoolean;

function TypeBoolean (path, value) {
  var boolean = new Boolean(value);
  boolean.__proto__ = TypeBoolean.prototype;
  boolean._path = path;
  boolean._value = value;
  return boolean;
}

TypeBoolean.prototype = new Boolean();

TypeBoolean.prototype.validate = function () {
  return 'boolean' === typeof this._value;
};

TypeBoolean.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this._value;
};
