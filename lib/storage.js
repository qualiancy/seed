
function storage () {
  var trans = require('./storage/memory');
  this.transport = new trans();
}

storage.prototype.sync = function (action, model, callback) {
  //console.log(action);
  this.transport.once('complete', function (err, mdl) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, mdl);
  });
  
  var data = model.serialize(),
      path = model.path;
  
  this.transport.emit(action, {
    data: data,
    path: path
  });
};

module.exports = storage;