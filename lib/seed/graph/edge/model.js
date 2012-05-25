var _ = require('../../utils')
  , Model = require('../../Model');

var EdgeSchema = require('./schema');

module.exports = Model.extend({

    schema: EdgeSchema

  , initialize: function () {

    }

  , load: function (cb) {
      var self = this
        , err = null;
      _.parallel([
          this.loadX.bind(this)
        , this.loadY.bind(this)
      ], function (fn, i, next) {
        fn(function (ex) {
          if (ex) err = ex;
          next();
        });
      }, function () {
        if (err) return cb(err);
        cb(null);
      });
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
    , type = this.get(vert).$ref
    , meta = graph._models.get(type)
    , model = new meta({ _id: id }, { parent: graph });

  model.fetch(function (err) {
    if (err) return cb(err);
    self.set(vert, model);
    graph.set(model);
    cb(null);
  });
}
