
module.exports = TypeObject;

function TypeObject (path, value) {
  var object = new Object(value);
  object.__proto__ = TypeObject.prototype;
  object._path = path;
  object._value = value;
  return object;
}

TypeObject.prototype = new Object();

TypeObject.prototype.validate = function () {
  return this._value
    && 'object' === typeof this._value
    && !Array.isArray(this._value);
};

TypeObject.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this._value;
};
