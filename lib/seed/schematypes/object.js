module.exports = TypeObject;

function TypeObject (path, value) {
  this.name = 'Object';
  this._path = path;
  this._value = value;
  return this;
}

TypeObject.prototype.validate = function () {
  return this._value
    && 'object' === typeof this._value
    && !Array.isArray(this._value);
};

TypeObject.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this._value;
};
