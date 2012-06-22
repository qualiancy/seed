
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
    , type = this._path.model
      ? (this._path.model.prototype.__type || 'model')
      : null;

  if (ref instanceof Model)
    return type
      ? (ref.type === type)
      : true;
  else if (ref
  && ('undefined' !== typeof ref.$ref)
  && ('undefined' !== typeof ref.$id))
    return type
      ? (ref.$ref === type)
      : true;
  else if (ref
  && ('undefined' !== typeof ref._bsontype)
  && (ref._bsontype === 'DBRef'))
    return type
      ? (ref.namespace === type)
      : true;

  return false;
};

DBRef.prototype.getValue = function (opts) {
  if (this._path && !this.validate())
    return undefined;

  opts = opts || {};
  var model = this._value
    , obj = {};

  if (model._bsontype === 'DBRef') {
    obj.$ref = model.namespace;
    obj.$id = model.oid;
  } else if (model instanceof Model && !opts.preserve) {
    obj.$ref = model.type;
    obj.$id = model.id;
  } else {
    obj = this._value;
  }

  return obj;
};
