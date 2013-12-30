
module.exports = ObjectId;

function ObjectId (path, value) {
  this._path = path;
  this._value = value;
}

ObjectId.prototype.validate = function () {
  var type = typeof this._value;
  return this._value && ('string' === type || 'number' === type);
};

ObjectId.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this._value;
};
