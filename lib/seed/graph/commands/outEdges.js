var util = require('util')
  , base = require('./base/edges');

module.exports = outEdges;

function outEdges () {
  base.apply(this, arguments);
  this.direction = 'y';
}

util.inherits(outEdges, base);
