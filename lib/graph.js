
var tea = require('tea')
  , drip = require('drip');

module.exports = Graph;

function Graph (options) {
  drip.call(this);
  
  options = options || {};
  this.initialize();
  return this;
}

tea.merge(Graph.prototype, drip.prototype);

Graph.extend = tea.extend;

Graph.toString = function () {
  return '[object Graph]';
};

// empty initilize function;
Graph.prototype.initialize = function () {};