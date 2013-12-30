var util = require('util');

module.exports = TypeNumber;

function TypeNumber (path, value) {
  var number = new Number(value);
  number.__proto__ = TypeNumber.prototype;
  number._path = path;
  number._value = value;
  return number;
}

TypeNumber.prototype = new Number();

TypeNumber.prototype.validate = function () {
  return this._value && 'number' === typeof this._value;
};

TypeNumber.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this._value;
};
