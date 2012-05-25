var util = require('util');

module.exports = TypeString;

function TypeString (path, value) {
  var string = new String(value);
  string.__proto__ = TypeString.prototype;
  string._path = path;
  string._value = value;
  return string;
}

TypeString.prototype = new String();

TypeString.prototype.validate = function () {
  return this._value && 'string' === typeof this._value;
};

TypeString.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this._value;
};
