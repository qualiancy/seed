var Model = require('../../Model');

var EdgeSchema = require('./schema');

module.exports = Model.extend({

    schema: EdgeSchema

  , initialize: function () {

    }

  , load: function (cb) {
      var self = this;
      this.loadX(function (err) {
        if (err) return cb(err);
        self.loadY(function (err) {
          if (err) return cb(err);
          cb(null);
        });
      })
    }

  , loadX: function (cb) {
      loadVertice.call(this, 'x', cb);
    }

  , loadY: function (cb) {
      loadVertice.call(this, 'y', cb);
    }

});

function loadVertice (vert, cb) {
  if (this.get(vert) instanceof Model)
    return cb(null);

  var self = this
    , graph = this.flag('parent')
    , id = this.get(vert).$id
    , type = this.get(vert).$rel
    , model = new graph._models.get(type)({ _id: id });

  model.fetch(function (err) {
    if (err) return cb(err);
    this.set(vert, model);
    graph.set(model);
    cb(null);
  });
}
