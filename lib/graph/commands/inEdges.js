var base = require('./base/edges')
  , inherits = require('super');

module.exports = inEdges;

function inEdges () {
  base.apply(this,arguments);
  this.direction = 'x';
}

inherits(inEdges, base);
