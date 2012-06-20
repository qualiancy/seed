var util = require('util')
  , base = require('./base/edges');

module.exports = inEdges;

function inEdges () {
  base.apply(this,arguments);
  this.direction = 'x';
}

util.inherits(inEdges, base);
