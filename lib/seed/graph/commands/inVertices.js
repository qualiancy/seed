var util = require('util')
  , base = require('./base/vertices');

module.exports = inVertices;

function inVertices () {
  base.apply(this, arguments);
  this.direction = 'x';
}

util.inherits(inVertices, base);
