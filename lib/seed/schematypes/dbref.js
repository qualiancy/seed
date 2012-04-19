
var Model = require('../model');

module.exports = DBRef;

function DBRef (spec, value) {
  this.name = 'DBRef';
  this._path = spec;
  this._value = value;
  return this;
}

DBRef.prototype.validate = function () {
  var constructed = this._value
    , type = this._path.model.prototype.__type || 'model';
  return (constructed instanceof Model && constructed.type == type);
};
