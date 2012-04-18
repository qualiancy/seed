
module.exports = EmbeddedSchema;

function EmbeddedSchema (spec, value) {
  this.name = 'EmbeddedSchema';
  this._path = spec;
  this._value = value;
  return this;
}

EmbeddedSchema.prototype.validate = function () {
  if (!Array.isArray(this._value)) return false;
  var schema = this._path.schema
  for (var i = 0; i < this._value.length; i++) {
    var value = this._value[i];
    if ('object' !== typeof value) return false;
    if (!schema.validate(value)) return false;
  }
  return true;
};

