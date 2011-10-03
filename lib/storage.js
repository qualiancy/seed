
function storage () {
  var trans = require('./transports/memory');
  this.transport = new trans();
}

storage.prototype.sync = function (action, model, callback) {
  console.log(action);
  
  var data = model.serialize(),
      path = model.path;
  
  var request = this.transport[action]({
    data: data,
    path: path || ''
  });
  
  var success = function (data) {
    callback(null, data);
  };
  
  var failure = function (message) {
    callback(message);
  };
  
  request.then(success, failure);
};

module.exports = storage;