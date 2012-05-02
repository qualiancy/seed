
var Model = require('../model');

module.exports = DBRef;

function DBRef (spec, value) {
  this.name = 'DBRef';
  this._path = spec;
  this._value = value;
  return this;
}

DBRef.prototype.validate = function () {
  var ref = this._value
    , type = (this._path.model) ? (this._path.model.prototype.__type || 'model') : null;

  if (ref instanceof Model) {
    return type ? (ref.type === type) : true;
  } else if (ref && ('undefined' !== typeof ref.$ref) && ('undefined' !== typeof ref.$id)) {
    return type ? (ref.$ref === type) : true;
  }

  return false;
};

DBRef.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  var model = this._value
    , obj = {};
  obj.$ref = model.type;
  obj.$id = model.id;
  return obj;
};
