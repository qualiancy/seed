
function storage () {
  var engine = require('./storage/memory');
  this.engine = new engine();
}

storage.prototype.sync = function (action, model) {
  var data = model._attributes,
      path = model.path;
  
  var oath = this.engine[action]({
    data: data,
    path: path || ''
  });
  
  return oath;
};

module.exports = storage;