
function storage () {
  var trans = require('./transports/memory');
  this.transport = new trans();
}

storage.prototype.sync = function (action, model) {
  console.log(action);
  
  var data = model.serialize(),
      path = model.path;
  
  var oath = this.transport[action]({
    data: data,
    path: path || ''
  });
  
  return oath;
};

module.exports = storage;