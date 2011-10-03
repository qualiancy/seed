
function storage () {
  var engine = require('./storage/memory');
  this.engine = new engine();
}

storage.prototype.sync = function (action, model) {
  console.log(action);
  
  var data = model.serialize(),
      path = model.path;
  
  var oath = this.engine[action]({
    data: data,
    path: path || ''
  });
  
  return oath;
};

module.exports = storage;