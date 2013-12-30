var base = require('./base/vertices')
  , inherits = require('super');

module.exports = inVertices;

function inVertices () {
  base.apply(this, arguments);
  this.direction = 'x';
}

inherits(inVertices, base);
