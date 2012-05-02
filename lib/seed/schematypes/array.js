var util = require('util');

module.exports = TypeArray;

function TypeArray (path, value) {
  var array = new Array(value);
  array.__proto__ = TypeArray.prototype;
  array._path = path;
  array._value = value;
  return array;
}

TypeArray.prototype = new Array();

TypeArray.prototype.validate = function () {
  return this._value && Array.isArray(this._value);
};

TypeArray.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this._value;
};
