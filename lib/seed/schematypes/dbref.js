
var Model = require('../model');

module.exports = DBRef;

function DBRef (spec, value) {
  this.name = 'DBRef';
  this._path = spec;
  this._value = value;
  return this;
}

Object.defineProperty(DBRef.prototype, 'value',
  { get: function () {
      if (!this.validate()) return undefined;
      var model = this._value
        , obj = {};
      obj.$ref = model.type;
      obj.$id = model.id;
      return obj;
    }
});

DBRef.prototype.validate = function () {
  var constructed = this._value;
  if (!(constructed instanceof Model)) return false;
  if (!this._path.model) return true;
  var type = this._path.model.prototype.__type || 'model';
  return constructed.type == type;
};
