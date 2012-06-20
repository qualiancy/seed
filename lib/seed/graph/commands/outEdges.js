var base = require('./base/edges')
  , inherits = require('super');

module.exports = outEdges;

function outEdges () {
  base.apply(this, arguments);
  this.direction = 'y';
}

inherits(outEdges, base);
