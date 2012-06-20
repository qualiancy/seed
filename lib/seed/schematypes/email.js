var inherits = require('super')
  , SeedString = require('./string');

module.exports = Email;

function Email (path, value) {
  this._path = path;
  this._value = value;
  return this;
}

inherits(Email, SeedString);

Email.prototype.validate = function () {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(this._value);
};

Email.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this._value;
};
