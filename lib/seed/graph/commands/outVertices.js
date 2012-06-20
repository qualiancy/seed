var base = require('./base/vertices')
  , inherits = require('super');

module.exports = outVertices;

function outVertices () {
  base.apply(this, arguments);
  this.direction = 'y';
}

inherits(outVertices, base);
