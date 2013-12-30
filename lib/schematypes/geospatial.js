var util = require('util');

module.exports = Geospatial;

/**
 * # Geospacial
 *
 * Used for geospatial data entry.
 *
 * - Longitute is easting is `x`
 * - Latitude is northing is `y`
 * - Altitude is `z` (optional)
 *
 * Value can be in the form of an Array with
 * the format `[ x, y ]` or `[ x, y, z ]`.
 *
 * Value can be in the form of an object with
 * the properties of `{ x: n, y: n, z: n }` or
 * `{ lon: n, lat: n, alt: n }`.
 */

function Geospatial (path, value) {
  this.name = 'Geospatial';
  this._path = path;
  this._value = {};

  // For array values
  if (Array.isArray(value)) {
    this._value.x = value[0];
    this._value.y = value[1];
    if (value[2]) this._value.z = value[2];
    return this;
  }

  if ('object' !== typeof value) return this;

  // For objects
  this._value.x = value.x || value.lon || null;
  this._value.y = value.y || value.lat || null;
  if (value.z || value.alt)
    this._value.z = value.z || value.alt;

  return this;
}

/**
 * # toArray
 *
 * Returns a GeoJSON formatted array for the
 * current location.
 *
 * @returns {Array}
 * @see http://geojson.org/geojson-spec.html#positions
 * @api public
 */

Geospatial.prototype.toArray = function () {
  var res = [ this._value.x, this._value.y ];
  if (this._value.z) res.push(this._value.z);
  return res;
};

/**
 * # validate
 *
 * Determine if the data currently stored in
 * the casted Schema Type is valid.
 *
 * @returns {Boolean}
 * @api public
 */

Geospatial.prototype.validate = function () {
  if (!this._value.x) return false;
  if (!this._value.y) return false;
  return true;
};

Geospatial.prototype.getValue = function () {
  if (!this.validate()) return undefined;
  return this.toArray();
};
