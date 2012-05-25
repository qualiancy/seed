var util = require('util')
  , base = require('./base/vertices');

module.exports = outVertices;

function outVertices () {
  base.apply(this, arguments);
  this.direction = 'y';
}

util.inherits(outVertices, base);
